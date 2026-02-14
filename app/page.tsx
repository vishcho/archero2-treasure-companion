'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { basePath } from './_utils/utils';

// 定義寶藏圖案的類型
type TreasureType = 'chest' | 'anchor' | 'dice' | 'sword' | 'crown' | 'cross' | 'key';

interface TreasurePiece {
  id: string;
  type: TreasureType;
  position: { row: number; col: number } | null;
  rotation: number; // 0, 90, 180, 270
}

interface TreasureTemplate {
  type: TreasureType;
  rotation: number; // 0, 90, 180, 270
}

// 每個圖案：occupied = 實際佔格，shape = 圖片矩形（渲染用外接矩形）
interface TreasureShapeDef {
  occupied: number[][];
  shape: number[][];
}

const treasureShapes: Record<TreasureType, TreasureShapeDef> = {
  anchor: {
    occupied: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    shape: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
  },
  chest: {
    occupied: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    shape: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  cross: {
    occupied: [
      [1, 1, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  crown: {
    occupied: [[1]],
    shape: [[1]],
  },
  dice: {
    occupied: [
      [1, 1],
      [1, 1],
    ],
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  key: {
    occupied: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    shape: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  sword: {
    occupied: [[1, 1]],
    shape: [[1, 1]],
  },
};

// 圖片路徑映射
const treasureImages: Record<TreasureType, string> = {
  chest: `${basePath}/chest.png`,
  anchor: `${basePath}/anchor.png`,
  dice: `${basePath}/dice.png`,
  sword: `${basePath}/sword.png`,
  crown: `${basePath}/crown.png`,
  cross: `${basePath}/cross.png`,
  key: `${basePath}/key.png`,
};

// 寶藏名稱映射
const treasureNames: Record<TreasureType, string> = {
  chest: '寶箱',
  anchor: '船錨',
  dice: '骰子',
  sword: '寶劍',
  crown: '黃冠',
  cross: '十字',
  key: '鑰匙',
};

// 旋轉矩陣
function rotateShape(shape: number[][], rotation: number): number[][] {
  if (rotation === 0) return shape;

  let rotated = shape;
  for (let i = 0; i < rotation / 90; i++) {
    const rows = rotated.length;
    const cols = rotated[0].length;
    const newShape: number[][] = [];

    for (let col = 0; col < cols; col++) {
      const newRow: number[] = [];
      for (let row = rows - 1; row >= 0; row--) {
        newRow.push(rotated[row][col]);
      }
      newShape.push(newRow);
    }
    rotated = newShape;
  }

  return rotated;
}

function getOccupiedShape(type: TreasureType, rotation: number): number[][] {
  return rotateShape(treasureShapes[type].occupied, rotation);
}

function getRenderShape(type: TreasureType, rotation: number): number[][] {
  return rotateShape(treasureShapes[type].shape, rotation);
}

const GRID_COLS = 10;
const GRID_ROWS = 12;

export default function Home() {
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null))
  );
  // 右側面板的寶藏模板（可旋轉，可重複使用）
  const [treasureTemplates, setTreasureTemplates] = useState<TreasureTemplate[]>([
    { type: 'chest', rotation: 0 },
    { type: 'anchor', rotation: 0 },
    { type: 'dice', rotation: 0 },
    { type: 'sword', rotation: 0 },
    { type: 'crown', rotation: 0 },
    { type: 'cross', rotation: 0 },
    { type: 'key', rotation: 0 },
  ]);
  // 已放置在網格上的寶藏實例
  const [placedTreasures, setPlacedTreasures] = useState<TreasurePiece[]>([]);
  const [nextId, setNextId] = useState(1);
  const [draggedTemplate, setDraggedTemplate] = useState<TreasureTemplate | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // 檢查位置是否有效（依實際佔格 occupied）
  const canPlace = (template: TreasureTemplate, row: number, col: number): boolean => {
    const shape = getOccupiedShape(template.type, template.rotation);
    const rows = shape.length;
    const cols = shape[0].length;

    if (row + rows > GRID_ROWS || col + cols > GRID_COLS) {
      return false;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c] === 1) {
          const gridRow = row + r;
          const gridCol = col + c;
          // 檢查該格子是否已被其他寶藏佔據
          if (grid[gridRow][gridCol] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // 放置寶藏（從模板創建新實例）
  const placeTreasure = (template: TreasureTemplate, row: number, col: number) => {
    if (!canPlace(template, row, col)) return false;

    const newId = `treasure-${nextId}`;
    const newPiece: TreasurePiece = {
      id: newId,
      type: template.type,
      position: { row, col },
      rotation: template.rotation,
    };

    const newGrid = grid.map(row => [...row]);
    const shape = getOccupiedShape(template.type, template.rotation);
    const rows = shape.length;
    const cols = shape[0].length;

    // 放置新位置（只寫入 occupied 格子）
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c] === 1) {
          newGrid[row + r][col + c] = newId;
        }
      }
    }

    setGrid(newGrid);
    setPlacedTreasures(prev => [...prev, newPiece]);
    setNextId(prev => prev + 1);
    return true;
  };

  // 移除已放置的寶藏
  const removePlacedTreasure = (pieceId: string) => {
    const newGrid = grid.map(row => [...row]);
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (newGrid[r][c] === pieceId) {
          newGrid[r][c] = null;
        }
      }
    }
    setGrid(newGrid);
    setPlacedTreasures(prev => prev.filter(p => p.id !== pieceId));
  };

  // 旋轉右側面板的模板
  const rotateTemplate = (type: TreasureType) => {
    setTreasureTemplates(prev =>
      prev.map(t =>
        t.type === type ? { ...t, rotation: (t.rotation + 90) % 360 } : t
      )
    );
  };

  // 處理拖曳開始（從模板）
  const handleDragStart = (e: React.DragEvent, template: TreasureTemplate) => {
    setDraggedTemplate(template);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // 處理拖曳結束
  const handleDragEnd = () => {
    setDraggedTemplate(null);
    setHoveredCell(null);
  };

  // 處理拖曳懸停
  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (draggedTemplate) {
      e.dataTransfer.dropEffect = canPlace(draggedTemplate, row, col) ? 'copy' : 'none';
      setHoveredCell({ row, col });
    }
  };

  // 處理放置
  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (draggedTemplate) {
      placeTreasure(draggedTemplate, row, col);
    }
    setDraggedTemplate(null);
    setHoveredCell(null);
  };

  // 處理拖曳離開
  const handleDragLeave = () => {
    setHoveredCell(null);
  };

  // 重置所有
  const resetAll = () => {
    setGrid(Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null)));
    setPlacedTreasures([]);
    setTreasureTemplates([
      { type: 'chest', rotation: 0 },
      { type: 'anchor', rotation: 0 },
      { type: 'dice', rotation: 0 },
      { type: 'sword', rotation: 0 },
      { type: 'crown', rotation: 0 },
      { type: 'cross', rotation: 0 },
      { type: 'key', rotation: 0 },
    ]);
  };

  // 渲染寶藏圖案預覽（在網格中顯示）：依 shape 矩形正確渲染，圖片為帶透明圖層的矩形
  const renderTreasureInGrid = (piece: TreasurePiece, cellRow: number, cellCol: number) => {
    if (!piece.position) return null;
    if (piece.position.row !== cellRow || piece.position.col !== cellCol) return null;

    const shape = getRenderShape(piece.type, piece.rotation);
    const rows = shape.length;
    const cols = shape[0].length;
    const imagePath = treasureImages[piece.type];
    const cellSize = '100%';
    const gapSize = '0.25rem';

    return (
      <div
        className="absolute z-10 pointer-events-none overflow-hidden"
        style={{
          left: 0,
          top: 0,
          width: `calc(${cols} * ${cellSize} + ${cols - 1} * ${gapSize})`,
          height: `calc(${rows} * ${cellSize} + ${rows - 1} * ${gapSize})`,
        }}
      >
        {imagePath ? (
          <div className="w-full h-full">
            <Image
              src={imagePath}
              alt={treasureNames[piece.type]}
              fill
              className="object-contain"
              style={{
                transform: `rotate(${piece.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full h-full bg-primary/20 border-2 border-primary rounded flex items-center justify-center text-xs">
            {treasureNames[piece.type]}
          </div>
        )}
      </div>
    );
  };

  // 渲染寶藏圖案預覽（在右側面板顯示模板，依 shape 矩形正確渲染）
  const renderTreasurePreview = (template: TreasureTemplate) => {
    const shape = getRenderShape(template.type, template.rotation);
    const rows = shape.length;
    const cols = shape[0].length;
    const imagePath = treasureImages[template.type];
    const size = Math.max(rows, cols) * 24;

    return (
      <div
        className="relative flex items-center justify-center mx-auto"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
        }}
      >
        <div
          className="relative"
          style={{
            width: `${cols * 24}px`,
            height: `${rows * 24}px`,
          }}
        >
          {imagePath ? (
            <Image
              src={imagePath}
              alt={treasureNames[template.type]}
              width={cols * 24}
              height={rows * 24}
              className="object-contain"
              style={{
                transform: `rotate(${template.rotation}deg)`,
                transformOrigin: 'center center',
              }}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-primary/20 border-2 border-primary rounded flex items-center justify-center text-xs">
              {treasureNames[template.type]}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Treasure Map Companion</h1>
        <Button onClick={resetAll} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* 左側：10x12 網格 */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Treasure Map</h2>
            <div className="grid grid-cols-10 gap-1 bg-muted p-2 rounded-lg relative">
              {Array(GRID_ROWS)
                .fill(null)
                .map((_, row) =>
                  Array(GRID_COLS)
                    .fill(null)
                    .map((_, col) => {
                      const pieceId = grid[row][col];
                      const piece = pieceId
                        ? placedTreasures.find(p => p.id === pieceId)
                        : null;

                      // 檢查這個格子是否在拖曳預覽的範圍內
                      let isInPreview = false;
                      let canPlaceHere = false;
                      if (draggedTemplate && hoveredCell) {
                        const shape = getOccupiedShape(draggedTemplate.type, draggedTemplate.rotation);
                        const startRow = hoveredCell.row;
                        const startCol = hoveredCell.col;
                        const rows = shape.length;
                        const cols = shape[0].length;

                        // 檢查這個格子是否在預覽範圍內
                        if (row >= startRow && row < startRow + rows &&
                          col >= startCol && col < startCol + cols) {
                          const relRow = row - startRow;
                          const relCol = col - startCol;
                          if (shape[relRow] && shape[relRow][relCol] === 1) {
                            isInPreview = true;
                            canPlaceHere = canPlace(draggedTemplate, startRow, startCol);
                          }
                        }
                      }

                      return (
                        <div
                          key={`${row}-${col}`}
                          onDragOver={e => handleDragOver(e, row, col)}
                          onDrop={e => handleDrop(e, row, col)}
                          onDragLeave={handleDragLeave}
                          onClick={() => {
                            if (pieceId) removePlacedTreasure(pieceId);
                          }}
                          className={cn(
                            'aspect-square border-2 rounded-sm transition-colors relative',
                            piece && 'cursor-pointer',
                            piece
                              ? 'bg-primary/20 border-primary'
                              : isInPreview && canPlaceHere
                                ? 'bg-success/20 border-success'
                                : isInPreview && !canPlaceHere
                                  ? 'bg-destructive/20 border-destructive'
                                  : 'bg-background border-border hover:border-primary/50'
                          )}
                        >
                          {piece && renderTreasureInGrid(piece, row, col)}
                        </div>
                      );
                    })
                )}
            </div>
          </CardContent>
        </Card>

        {/* 右側：可拖曳的寶藏圖案 */}
        <Card className="w-full lg:w-64">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Treasure Pieces</h2>
            <div className="flex flex-col gap-4">
              {treasureTemplates.map(template => (
                <div
                  key={template.type}
                  draggable
                  onDragStart={e => handleDragStart(e, template)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'p-3 border-2 rounded-lg cursor-move transition-all',
                    'border-border hover:border-primary/50 hover:bg-accent/50',
                    draggedTemplate?.type === template.type && 'opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {treasureNames[template.type]}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateTemplate(template.type);
                        }}
                        title="Rotate"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {renderTreasurePreview(template)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
