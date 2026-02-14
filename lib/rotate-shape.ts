/**
 * 旋轉形狀矩陣
 * @param shape 二維陣列，表示形狀（1 表示佔據，0 表示空白）
 * @param rotation 旋轉角度（0, 90, 180, 270）
 * @returns 旋轉後的形狀矩陣
 */
export function rotateShape(shape: number[][], rotation: number): number[][] {
    if (rotation === 0) return shape;

    // 處理空陣列或無效輸入
    if (!shape || shape.length === 0 || !shape[0] || shape[0].length === 0) {
        return shape;
    }

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
