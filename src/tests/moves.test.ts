import { describe, it, expect } from "vitest";
import { Pawn } from "../models/Figures/Pawn";
import { Rook } from "../models/Figures/Rook";
import { Knight } from "../models/Figures/Knight";
import { Bishop } from "../models/Figures/Bishop";
import { Queen } from "../models/Figures/Queen";
import { King } from "../models/Figures/King";
import { emptyBoard, place, legal, move } from "./testHelpers";

describe("ходы пешки", () => {
    it("белая пешка ходит на одну клетку вперёд", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        expect(legal(board, 6, 4, 5, 4)).toBe(true);
    });

    it("пешка с начальной позиции ходит на две клетки", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        expect(legal(board, 6, 4, 4, 4)).toBe(true);
    });

    it("пешка, которая уже ходила, не ходит на две клетки", () => {
        const board = emptyBoard();
        const pawn = place(board, Pawn, "white", 5, 4);
        pawn.isMoved = true;
        expect(legal(board, 5, 4, 3, 4)).toBe(false);
        expect(legal(board, 5, 4, 4, 4)).toBe(true);
    });

    it("пешка не ходит на занятую клетку впереди", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        place(board, Rook, "black", 5, 4);
        expect(legal(board, 6, 4, 5, 4)).toBe(false);
    });

    it("двойной ход блокируется фигурой на промежуточной клетке", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        place(board, Knight, "black", 4, 4);
        expect(legal(board, 6, 4, 4, 4)).toBe(false);
    });

    it("пешка берёт вражескую фигуру по диагонали", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        place(board, Rook, "black", 5, 3);
        expect(legal(board, 6, 4, 5, 3)).toBe(true);
    });

    it("пешка не ходит по диагонали на пустую клетку", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 6, 4);
        expect(legal(board, 6, 4, 5, 3)).toBe(false);
    });

    it("чёрная пешка ходит вниз (к большим номерам строк)", () => {
        const board = emptyBoard();
        place(board, Pawn, "black", 1, 4);
        expect(legal(board, 1, 4, 2, 4)).toBe(true);
        expect(legal(board, 1, 4, 0, 4)).toBe(false);
    });

    it("чёрная пешка берёт белую фигуру по диагонали", () => {
        const board = emptyBoard();
        place(board, Pawn, "black", 1, 4);
        place(board, Rook, "white", 2, 5);
        expect(legal(board, 1, 4, 2, 5)).toBe(true);
    });
});

describe("ходы остальных фигур", () => {
    it("конь ходит буквой Г и перепрыгивает фигуры", () => {
        const board = emptyBoard();
        place(board, Knight, "white", 4, 4);
        place(board, Rook, "black", 5, 4);
        expect(legal(board, 4, 4, 6, 5)).toBe(true);
        expect(legal(board, 4, 4, 5, 6)).toBe(true);
        expect(legal(board, 4, 4, 5, 4)).toBe(false);
    });

    it("конь не ходит на свою фигуру", () => {
        const board = emptyBoard();
        place(board, Knight, "white", 4, 4);
        place(board, Pawn, "white", 6, 5);
        expect(legal(board, 4, 4, 6, 5)).toBe(false);
    });

    it("слон ходит по диагонали и не перепрыгивает фигуры", () => {
        const board = emptyBoard();
        place(board, Bishop, "white", 4, 4);
        expect(legal(board, 4, 4, 1, 1)).toBe(true);
        expect(legal(board, 4, 4, 4, 6)).toBe(false);
    });

    it("слон блокируется фигурой на пути и не ходит на свою", () => {
        const board = emptyBoard();
        place(board, Bishop, "white", 4, 4);
        place(board, Pawn, "black", 3, 3);
        expect(legal(board, 4, 4, 1, 1)).toBe(false);

        const board2 = emptyBoard();
        place(board2, Bishop, "white", 4, 4);
        place(board2, Pawn, "white", 1, 1);
        expect(legal(board2, 4, 4, 1, 1)).toBe(false);
    });

    it("ладья ходит по прямой и не перепрыгивает фигуры", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        expect(legal(board, 4, 4, 4, 7)).toBe(true);
        expect(legal(board, 4, 4, 0, 0)).toBe(false);

        place(board, Pawn, "black", 4, 5);
        expect(legal(board, 4, 4, 4, 7)).toBe(false);
    });

    it("ладья берёт вражескую фигуру на линии", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        place(board, Pawn, "black", 4, 6);
        expect(legal(board, 4, 4, 4, 6)).toBe(true);
    });

    it("ферзь ходит по прямой и по диагонали, в том числе в обратную сторону", () => {
        const board = emptyBoard();
        place(board, Queen, "white", 4, 4);
        expect(legal(board, 4, 4, 0, 4)).toBe(true);
        expect(legal(board, 4, 4, 0, 0)).toBe(true);
        expect(legal(board, 4, 4, 2, 6)).toBe(true);
        expect(legal(board, 4, 4, 1, 2)).toBe(false);
    });

    it("король ходит на одну клетку и не ходит на две без ладьи", () => {
        const board = emptyBoard();
        place(board, King, "white", 4, 4);
        expect(legal(board, 4, 4, 4, 5)).toBe(true);
        expect(legal(board, 4, 4, 4, 6)).toBe(false);
    });

    it("король не встаёт на свою фигуру", () => {
        const board = emptyBoard();
        place(board, King, "white", 4, 4);
        place(board, Pawn, "white", 4, 5);
        expect(legal(board, 4, 4, 4, 5)).toBe(false);
    });
});

describe("очередь и выбор", () => {
    it("нельзя ходить фигурой чужого цвета", () => {
        const board = emptyBoard();
        place(board, Pawn, "black", 1, 4);
        move(board, 1, 4, 2, 4);
        expect(board.getCell(1, 4).cellFigure).not.toBeNull();
        expect(board.whoMoves).toBe("white");
    });

    it("после хода очередь переходит к другой стороне", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 0);
        place(board, King, "black", 0, 7);
        place(board, Pawn, "white", 6, 4);
        place(board, Pawn, "black", 1, 4);
        move(board, 6, 4, 5, 4);
        expect(board.whoMoves).toBe("black");
    });

    it("выбор своей фигуры записывается в selectedCell", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        const cell = board.getCell(4, 4);
        board.selectCell(cell);
        expect(board.selectedCell).toBe(cell);
    });

    it("клик по пустой клетке снимает выбор", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        board.selectCell(board.getCell(4, 4));
        board.selectCell(board.getCell(3, 3));
        expect(board.selectedCell).toBeNull();
    });

    it("повторный клик по выбранной фигуре снимает выбор", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        board.selectCell(board.getCell(4, 4));
        board.selectCell(board.getCell(4, 4));
        expect(board.selectedCell).toBeNull();
    });

    it("клик по чужой фигуре снимает выбор", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        place(board, Pawn, "black", 1, 4);
        board.selectCell(board.getCell(4, 4));
        board.selectCell(board.getCell(1, 4));
        expect(board.selectedCell).toBeNull();
    });

    it("подсветка показывает только допустимые ходы выбранной фигуры", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        place(board, Pawn, "white", 4, 6);
        board.selectCell(board.getCell(4, 4));
        const highlighted = board.cells.flat().filter(c => c.isAvailable).length;
        expect(highlighted).toBe(12);
    });

    it("после хода подсветка сбрасывается", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 0);
        place(board, King, "black", 0, 7);
        place(board, Rook, "white", 4, 4);
        board.selectCell(board.getCell(4, 4));
        move(board, 4, 4, 4, 7);
        expect(board.cells.flat().some(c => c.isAvailable)).toBe(false);
        expect(board.selectedCell).toBeNull();
    });
});
