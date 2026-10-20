import { describe, it, expect } from "vitest";
import { Pawn } from "../models/Figures/Pawn";
import { Rook } from "../models/Figures/Rook";
import { King } from "../models/Figures/King";
import { emptyBoard, place, legal, move } from "./testHelpers";

describe("взятие на проход", () => {
    it("разрешено сразу после двойного хода соперника", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        place(board, Pawn, "black", 1, 3);
        board.whoMoves = "black";
        move(board, 1, 3, 3, 3);
        expect(board.enPassantTarget).toBe(board.getCell(2, 3));
        expect(legal(board, 3, 4, 2, 3)).toBe(true);
    });

    it("при взятии съедаемая пешка удаляется и попадает в список съеденных", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        place(board, Pawn, "black", 1, 3);
        board.whoMoves = "black";
        move(board, 1, 3, 3, 3);
        move(board, 3, 4, 2, 3);
        expect(board.getCell(3, 3).cellFigure).toBeNull();
        expect(board.getCell(2, 3).cellFigure).not.toBeNull();
        expect(board.lostBlackFigures.map(f => f.name)).toEqual(["PAWN"]);
    });

    it("право пропадает, если соперник не взял сразу", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        place(board, Pawn, "black", 1, 3);
        place(board, Pawn, "white", 6, 0);
        place(board, Pawn, "black", 1, 0);
        board.whoMoves = "black";
        move(board, 1, 3, 3, 3);
        move(board, 6, 0, 5, 0);
        expect(board.enPassantTarget).toBeNull();
        expect(legal(board, 3, 4, 2, 3)).toBe(false);
    });

    it("взятие, которое открывает линию на короля, запрещено", () => {
        const board = emptyBoard();
        place(board, King, "white", 3, 0);
        place(board, Pawn, "white", 3, 4);
        place(board, Pawn, "black", 1, 3);
        place(board, Rook, "black", 3, 7);
        board.whoMoves = "black";
        move(board, 1, 3, 3, 3);
        expect(legal(board, 3, 4, 2, 3)).toBe(false);
    });

    it("без ладьи на той же линии взятие на проход разрешено", () => {
        const board = emptyBoard();
        place(board, King, "white", 3, 0);
        place(board, Pawn, "white", 3, 4);
        place(board, Pawn, "black", 1, 3);
        board.whoMoves = "black";
        move(board, 1, 3, 3, 3);
        expect(legal(board, 3, 4, 2, 3)).toBe(true);
    });
});
