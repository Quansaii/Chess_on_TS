import { describe, it, expect } from "vitest";
import { Pawn } from "../models/Figures/Pawn";
import { Rook } from "../models/Figures/Rook";
import { Queen } from "../models/Figures/Queen";
import { Knight } from "../models/Figures/Knight";
import { emptyBoard, place, move } from "./testHelpers";

describe("превращение пешки", () => {
    it("пешка на последней горизонтали ждёт выбора, ход не передаётся", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 1, 4);
        move(board, 1, 4, 0, 4);
        expect(board.pawnCell).toBe(board.getCell(0, 4));
        expect(board.whoMoves).toBe("white");
    });

    it("пока ждём выбор, другие ходы не работают", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 1, 4);
        const rook = place(board, Rook, "white", 7, 0);
        move(board, 1, 4, 0, 4);
        move(board, 7, 0, 7, 1);
        expect(board.getCell(7, 0).cellFigure).toBe(rook);
    });

    it("белая пешка превращается в ферзя, очередь переходит", () => {
        const board = emptyBoard();
        const pawn = place(board, Pawn, "white", 1, 4);
        move(board, 1, 4, 0, 4);
        board.promotePawn("QUEEN");
        const figure = board.getCell(0, 4).cellFigure;
        expect(figure).toBeInstanceOf(Queen);
        expect(figure?.color).toBe("white");
        expect(figure?.id).toBe(pawn.id);
        expect(board.pawnCell).toBeNull();
        expect(board.whoMoves).toBe("black");
    });

    it("чёрная пешка превращается в коня", () => {
        const board = emptyBoard();
        board.whoMoves = "black";
        place(board, Pawn, "black", 6, 2);
        move(board, 6, 2, 7, 2);
        board.promotePawn("KNIGHT");
        const figure = board.getCell(7, 2).cellFigure;
        expect(figure).toBeInstanceOf(Knight);
        expect(figure?.color).toBe("black");
    });

    it("ладья и слон тоже доступны как варианты", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 1, 4);
        move(board, 1, 4, 0, 4);
        board.promotePawn("ROOK");
        expect(board.getCell(0, 4).cellFigure).toBeInstanceOf(Rook);
    });

    it("взятие с превращением добавляет съеденную фигуру один раз", () => {
        const board = emptyBoard();
        place(board, Pawn, "white", 1, 4);
        place(board, Rook, "black", 0, 3);
        move(board, 1, 4, 0, 3);
        board.promotePawn("QUEEN");
        expect(board.lostBlackFigures.map(f => f.name)).toEqual(["ROOK"]);
    });

    it("promotePawn без ожидающего превращения ничего не делает", () => {
        const board = emptyBoard();
        board.promotePawn("QUEEN");
        expect(board.whoMoves).toBe("white");
        expect(board.pawnCell).toBeNull();
    });
});
