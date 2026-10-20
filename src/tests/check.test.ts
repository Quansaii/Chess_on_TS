import { describe, it, expect } from "vitest";
import { Pawn } from "../models/Figures/Pawn";
import { Rook } from "../models/Figures/Rook";
import { Knight } from "../models/Figures/Knight";
import { Bishop } from "../models/Figures/Bishop";
import { King } from "../models/Figures/King";
import { emptyBoard, place, legal, move } from "./testHelpers";

describe("атака клеток", () => {
    it("ладья атакует клетку по линии, а фигура своего цвета атаки не даёт", () => {
        const board = emptyBoard();
        place(board, Rook, "black", 0, 4);
        expect(board.isSquareAttacked(board.getCell(4, 4), "black")).toBe(true);
        expect(board.isSquareAttacked(board.getCell(4, 4), "white")).toBe(false);
    });

    it("атака видна на клетке, где стоит фигура (защита)", () => {
        const board = emptyBoard();
        place(board, Rook, "black", 0, 4);
        place(board, Pawn, "white", 4, 4);
        expect(board.isSquareAttacked(board.getCell(4, 4), "black")).toBe(true);
    });

    it("фигура на пути блокирует атаку", () => {
        const board = emptyBoard();
        place(board, Rook, "black", 0, 4);
        place(board, Pawn, "white", 3, 4);
        expect(board.isSquareAttacked(board.getCell(4, 4), "black")).toBe(false);
    });

    it("пешка атакует диагонали впереди себя, но не прямо", () => {
        const board = emptyBoard();
        place(board, Pawn, "black", 1, 4);
        expect(board.isSquareAttacked(board.getCell(2, 3), "black")).toBe(true);
        expect(board.isSquareAttacked(board.getCell(2, 5), "black")).toBe(true);
        expect(board.isSquareAttacked(board.getCell(2, 4), "black")).toBe(false);
    });
});

describe("шах", () => {
    it("ладья даёт шах королю по открытой линии", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "black", 0, 4);
        expect(board.isInCheck("white")).toBe(true);
        expect(board.isInCheck("black")).toBe(false);
    });

    it("фигура между ладьёй и королём блокирует шах", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "black", 0, 4);
        place(board, Pawn, "white", 4, 4);
        expect(board.isInCheck("white")).toBe(false);
    });

    it("пешка даёт шах по диагонали", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Pawn, "black", 6, 3);
        expect(board.isInCheck("white")).toBe(true);
    });

    it("конь даёт шах и не блокируется", () => {
        const board = emptyBoard();
        place(board, King, "white", 4, 4);
        place(board, Knight, "black", 2, 5);
        place(board, Pawn, "white", 3, 4);
        expect(board.isInCheck("white")).toBe(true);
    });

    it("король не может встать на клетку под ударом", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "black", 0, 5);
        expect(legal(board, 7, 4, 7, 5)).toBe(false);
        expect(legal(board, 7, 4, 7, 3)).toBe(true);
    });

    it("ход, который оставляет короля под шахом, не выполняется", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 6, 4);
        place(board, Rook, "black", 0, 4);
        const rook = board.getCell(6, 4).cellFigure;
        move(board, 6, 4, 6, 0);
        expect(board.getCell(6, 4).cellFigure).toBe(rook);
        expect(board.whoMoves).toBe("white");
    });

    it("ход фигуры, которая блокирует линию, разрешён", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "white", 6, 4);
        place(board, Rook, "black", 0, 4);
        expect(legal(board, 6, 4, 5, 4)).toBe(true);
    });

    it("взятие шахующей фигуры разрешено и снимает шах", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "black", 0, 4);
        place(board, Bishop, "white", 2, 2);
        expect(legal(board, 2, 2, 0, 4)).toBe(true);
    });

    it("ход, который снимает шах уходом короля, разрешён", () => {
        const board = emptyBoard();
        place(board, King, "white", 7, 4);
        place(board, Rook, "black", 0, 4);
        expect(legal(board, 7, 4, 7, 3)).toBe(true);
    });
});
