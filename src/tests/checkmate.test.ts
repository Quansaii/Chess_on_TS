import { describe, it, expect } from "vitest";
import { Board } from "../models/Board";
import { Rook } from "../models/Figures/Rook";
import { Queen } from "../models/Figures/Queen";
import { King } from "../models/Figures/King";
import { Bishop } from "../models/Figures/Bishop";
import { emptyBoard, place, move } from "./testHelpers";

describe("мат", () => {
    it("ладья ставит мат на последней горизонтали, статус checkmate", () => {
        const board = emptyBoard();
        place(board, King, "white", 2, 6);
        place(board, Rook, "white", 1, 0);
        place(board, King, "black", 0, 7);
        move(board, 1, 0, 0, 0);
        expect(board.gameStatus).toBe("checkmate");
    });

    it("после мата ходы и выбор не работают", () => {
        const board = emptyBoard();
        place(board, King, "white", 2, 6);
        place(board, Rook, "white", 1, 0);
        place(board, King, "black", 0, 7);
        move(board, 1, 0, 0, 0);
        board.selectCell(board.getCell(0, 7));
        expect(board.selectedCell).toBeNull();
        move(board, 0, 7, 0, 6);
        expect(board.getCell(0, 7).cellFigure).not.toBeNull();
    });

    it("hasLegalMoves возвращает false для мата", () => {
        const board = emptyBoard();
        place(board, King, "white", 2, 6);
        place(board, Rook, "white", 0, 0);
        place(board, King, "black", 0, 7);
        expect(board.hasLegalMoves("black")).toBe(false);
    });
});

describe("пат", () => {
    it("король не под шахом и без ходов — статус stalemate", () => {
        const board = emptyBoard();
        place(board, King, "white", 2, 6);
        place(board, Queen, "white", 1, 4);
        place(board, King, "black", 0, 7);
        move(board, 1, 4, 1, 5);
        expect(board.gameStatus).toBe("stalemate");
    });
});

describe("статус партии", () => {
    it("ход, который снимает шах взятием, не даёт мат", () => {
        const board = emptyBoard();
        place(board, King, "white", 2, 6);
        place(board, Rook, "white", 1, 0);
        place(board, King, "black", 0, 7);
        place(board, Bishop, "black", 1, 1);
        move(board, 1, 0, 0, 0);
        expect(board.gameStatus).toBe("playing");
        expect(board.hasLegalMoves("black")).toBe(true);
    });

    it("в начальной позиции у белых есть ходы", () => {
        const board = new Board(1);
        board.initCells();
        board.addFigures();
        expect(board.hasLegalMoves("white")).toBe(true);
        expect(board.gameStatus).toBe("playing");
    });
});
