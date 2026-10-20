import { describe, it, expect } from "vitest";
import { Board } from "../models/Board";
import type { Cell } from "../models/Cell";
import type { figureColor } from "../models/Colors";
import type { Figure } from "../models/Figures/Figure";
import { King } from "../models/Figures/King";
import { Rook } from "../models/Figures/Rook";
import { Bishop } from "../models/Figures/Bishop";

type FigureCtor = new (id:number, color:figureColor, cell:Cell) => Figure;

let nextId = 1;

function emptyBoard(): Board {
    const board = new Board(1);
    board.initCells();
    return board;
}

function place(board:Board, Ctor:FigureCtor, color:figureColor, x:number, y:number): Figure {
    const cell = board.getCell(x, y);
    const figure = new Ctor(nextId++, color, cell);
    cell.cellFigure = figure;
    return figure;
}

function legal(board:Board, fromX:number, fromY:number, toX:number, toY:number): boolean {
    return board.isMoveLegal(board.getCell(fromX, fromY), board.getCell(toX, toY));
}

describe("рокировка: выполнение хода", () => {
    it("короткая рокировка белых: король на g1, ладья на f1", () => {
        const board = emptyBoard();
        const king = place(board, King, "white", 7, 4);
        const rook = place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);

        board.moveFigure(board.getCell(7, 4), board.getCell(7, 6));

        expect(board.getCell(7, 6).cellFigure).toBe(king);
        expect(board.getCell(7, 5).cellFigure).toBe(rook);
        expect(board.getCell(7, 7).cellFigure).toBeNull();
        expect(king.isMoved).toBe(true);
        expect(rook.isMoved).toBe(true);
        expect(board.whoMoves).toBe("black");
    });

    it("длинная рокировка белых: король на c1, ладья на d1", () => {
        const board = emptyBoard();
        const king = place(board, King, "white", 7, 4);
        const rook = place(board, Rook, "white", 7, 0);
        place(board, King, "black", 0, 0);

        board.moveFigure(board.getCell(7, 4), board.getCell(7, 2));

        expect(board.getCell(7, 2).cellFigure).toBe(king);
        expect(board.getCell(7, 3).cellFigure).toBe(rook);
        expect(board.getCell(7, 0).cellFigure).toBeNull();
        expect(board.whoMoves).toBe("black");
    });

    it("короткая рокировка чёрных на ряду 0", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 0);
        const king = place(board, King, "black", 0, 4);
        const rook = place(board, Rook, "black", 0, 7);
        board.whoMoves = "black";

        board.moveFigure(board.getCell(0, 4), board.getCell(0, 6));

        expect(board.getCell(0, 6).cellFigure).toBe(king);
        expect(board.getCell(0, 5).cellFigure).toBe(rook);
        expect(board.whoMoves).toBe("white");
    });
});

describe("рокировка: что разрешено", () => {
    it("длинная рокировка разрешена, даже если b1 атакована", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 0);
        place(board, King, "black", 0, 0);
        place(board, Rook, "black", 0, 1);

        expect(legal(board, 7, 4, 7, 2)).toBe(true);
    });
});

describe("рокировка: что запрещено", () => {
    it("король уже ходил", () => {
        const board = emptyBoard();
        const king = place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        king.isMoved = true;

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("ладья уже ходила", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        const rook = place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        rook.isMoved = true;

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("между королём и ладьёй стоит фигура", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        place(board, Bishop, "white", 7, 5);

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("король под шахом", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        place(board, Rook, "black", 0, 4);

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("король проходит через атакованную клетку", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        place(board, Rook, "black", 0, 5);

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("конечная клетка короля атакована", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        place(board, Rook, "black", 0, 6);

        expect(legal(board, 7, 4, 7, 6)).toBe(false);
    });

    it("запрещённая рокировка не меняет доску", () => {
        const board = emptyBoard();
        const king = place(board, King, "white", 7, 4);
        const rook = place(board, Rook, "white", 7, 7);
        place(board, King, "black", 0, 0);
        place(board, Rook, "black", 0, 6);

        board.moveFigure(board.getCell(7, 4), board.getCell(7, 6));

        expect(board.getCell(7, 4).cellFigure).toBe(king);
        expect(board.getCell(7, 7).cellFigure).toBe(rook);
        expect(board.whoMoves).toBe("white");
        expect(king.isMoved).toBe(false);
        expect(rook.isMoved).toBe(false);
    });
});
