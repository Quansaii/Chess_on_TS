import { describe, it, expect } from "vitest";
import { Pawn } from "../models/Figures/Pawn";
import { Rook } from "../models/Figures/Rook";
import { Knight } from "../models/Figures/Knight";
import { Bishop } from "../models/Figures/Bishop";
import { emptyBoard, place, move } from "./testHelpers";

describe("съеденные фигуры", () => {
    it("белая пешка съедает чёрного коня: конь попадает в lostBlackFigures", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        place(board, Knight, "black", 2, 5);
        move(board, 3, 4, 2, 5);
        expect(board.lostBlackFigures.map(f => f.name)).toEqual(["KNIGHT"]);
        expect(board.lostWhiteFigures).toEqual([]);
    });

    it("чёрная ладья съедает белого слона: слон попадает в lostWhiteFigures", () => {
        const board = emptyBoard();
        board.whoMoves = "black";
        place(board, Rook, "black", 4, 0);
        place(board, Bishop, "white", 4, 3);
        move(board, 4, 0, 4, 3);
        expect(board.lostWhiteFigures.map(f => f.name)).toEqual(["BISHOP"]);
        expect(board.lostBlackFigures).toEqual([]);
    });

    it("съеденная фигура удаляется, а на клетке оказывается атакующая", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        const knight = place(board, Knight, "black", 2, 5);
        move(board, 3, 4, 2, 5);
        expect(board.getCell(2, 5).cellFigure).not.toBe(knight);
        expect(board.getCell(3, 4).cellFigure).toBeNull();
    });

    it("несколько взятий накапливаются в списке", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 3, 4);
        place(board, Knight, "black", 2, 5);
        place(board, Knight, "black", 2, 3);
        move(board, 3, 4, 2, 5);
        board.whoMoves = "white";
        place(board, Pawn, "white", 3, 2);
        move(board, 3, 2, 2, 3);
        expect(board.lostBlackFigures.map(f => f.name)).toEqual(["KNIGHT", "KNIGHT"]);
    });

    it("ход на свою фигуру не добавляет ничего в списки", () => {
        const board = emptyBoard();
        place(board, Rook, "white", 4, 4);
        place(board, Pawn, "white", 4, 5);
        move(board, 4, 4, 4, 5);
        expect(board.lostWhiteFigures).toEqual([]);
        expect(board.lostBlackFigures).toEqual([]);
    });
});
