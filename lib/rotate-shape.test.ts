import { describe, it, expect } from 'vitest';
import { rotateShape } from './rotate-shape';

describe('rotateShape', () => {
    describe('0 度旋轉（不變）', () => {
        it('應該返回原始形狀', () => {
            const shape = [
                [1, 1],
                [1, 1],
            ];
            const result = rotateShape(shape, 0);
            expect(result).toEqual(shape);
        });

        it('應該返回原始矩形形狀', () => {
            const shape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const result = rotateShape(shape, 0);
            expect(result).toEqual(shape);
        });
    });

    describe('90 度順時針旋轉', () => {
        it('應該正確旋轉 2x2 正方形', () => {
            const shape = [
                [1, 2],
                [3, 4],
            ];
            const expected = [
                [3, 1],
                [4, 2],
            ];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 2x3 矩形（寶箱）', () => {
            const shape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const expected = [
                [1, 1],
                [1, 1],
                [1, 1],
            ];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 3x2 矩形', () => {
            const shape = [
                [1, 1],
                [1, 1],
                [1, 1],
            ];
            const expected = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 L 形（船錨）', () => {
            const shape = [
                [0, 1],
                [1, 1],
                [0, 1],
            ];
            const expected = [
                [0, 1, 0],
                [1, 1, 1],
            ];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉單格', () => {
            const shape = [[1]];
            const expected = [[1]];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });
    });

    describe('180 度旋轉', () => {
        it('應該正確旋轉 2x2 正方形', () => {
            const shape = [
                [1, 2],
                [3, 4],
            ];
            const expected = [
                [4, 3],
                [2, 1],
            ];
            const result = rotateShape(shape, 180);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 2x3 矩形', () => {
            const shape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const expected = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const result = rotateShape(shape, 180);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 L 形', () => {
            const shape = [
                [0, 1],
                [1, 1],
                [0, 1],
            ];
            const expected = [
                [1, 0],
                [1, 1],
                [1, 0],
            ];
            const result = rotateShape(shape, 180);
            expect(result).toEqual(expected);
        });
    });

    describe('270 度旋轉（等同於逆時針 90 度）', () => {
        it('應該正確旋轉 2x2 正方形', () => {
            const shape = [
                [1, 2],
                [3, 4],
            ];
            const expected = [
                [2, 4],
                [1, 3],
            ];
            const result = rotateShape(shape, 270);
            expect(result).toEqual(expected);
        });

        it('應該正確旋轉 2x3 矩形', () => {
            const shape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const expected = [
                [1, 1],
                [1, 1],
                [1, 1],
            ];
            const result = rotateShape(shape, 270);
            expect(result).toEqual(expected);
        });

        it('270 度旋轉應該等同於 90 度旋轉的逆轉', () => {
            const shape = [
                [1, 2, 3],
                [4, 5, 6],
            ];
            const rotated90 = rotateShape(shape, 90);
            const rotated270 = rotateShape(shape, 270);
            const backToOriginal = rotateShape(rotated90, 180);
            expect(rotated270).toEqual(backToOriginal);
        });
    });

    describe('多次旋轉的一致性', () => {
        it('旋轉 360 度應該回到原始形狀', () => {
            const shape = [
                [1, 2, 3],
                [4, 5, 6],
            ];
            const result = rotateShape(shape, 360);
            expect(result).toEqual(shape);
        });

        it('旋轉 4 次 90 度應該回到原始形狀', () => {
            const shape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            let result = shape;
            for (let i = 0; i < 4; i++) {
                result = rotateShape(result, 90);
            }
            expect(result).toEqual(shape);
        });

        it('90 + 90 應該等於 180', () => {
            const shape = [
                [1, 2],
                [3, 4],
            ];
            const rotated90x2 = rotateShape(rotateShape(shape, 90), 90);
            const rotated180 = rotateShape(shape, 180);
            expect(rotated90x2).toEqual(rotated180);
        });

        it('90 + 180 應該等於 270', () => {
            const shape = [
                [1, 2],
                [3, 4],
            ];
            const rotated90then180 = rotateShape(rotateShape(shape, 90), 180);
            const rotated270 = rotateShape(shape, 270);
            expect(rotated90then180).toEqual(rotated270);
        });
    });

    describe('邊界情況', () => {
        it('應該處理空陣列（雖然不應該發生）', () => {
            const shape: number[][] = [];
            const result = rotateShape(shape, 90);
            expect(result).toEqual([]);
        });

        it('應該處理單行陣列', () => {
            const shape = [[1, 1, 1]];
            const expected = [[1], [1], [1]];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該處理單列陣列', () => {
            const shape = [[1], [1], [1]];
            const expected = [[1, 1, 1]];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });

        it('應該處理不規則形狀（L 形）', () => {
            const shape = [
                [1, 1, 1],
                [1, 0, 0],
            ];
            const expected = [
                [1, 1],
                [0, 1],
                [0, 1],
            ];
            const result = rotateShape(shape, 90);
            expect(result).toEqual(expected);
        });
    });

    describe('實際遊戲物件形狀測試', () => {
        it('應該正確旋轉寶箱 (chest) 形狀', () => {
            // 寶箱：2x3
            const chestShape = [
                [1, 1, 1],
                [1, 1, 1],
            ];
            const rotated90 = rotateShape(chestShape, 90);
            expect(rotated90).toEqual([
                [1, 1],
                [1, 1],
                [1, 1],
            ]);
        });

        it('應該正確旋轉船錨 (anchor) 形狀', () => {
            // 船錨：3x2 L 形
            const anchorShape = [
                [0, 1],
                [1, 1],
                [0, 1],
            ];
            const rotated90 = rotateShape(anchorShape, 90);
            expect(rotated90).toEqual([
                [0, 1, 0],
                [1, 1, 1],
            ]);
        });

        it('應該正確旋轉骰子 (dice) 形狀', () => {
            // 骰子：2x2
            const diceShape = [
                [1, 1],
                [1, 1],
            ];
            const rotated90 = rotateShape(diceShape, 90);
            expect(rotated90).toEqual([
                [1, 1],
                [1, 1],
            ]);
        });

        it('應該正確旋轉鑰匙 (key) 形狀', () => {
            // 鑰匙：2x3 L 形
            const keyShape = [
                [1, 1, 1],
                [1, 0, 0],
            ];
            const rotated90 = rotateShape(keyShape, 90);
            expect(rotated90).toEqual([
                [1, 1],
                [0, 1],
                [0, 1],
            ]);
        });
    });
});
