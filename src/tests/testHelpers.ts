import { Board } from "../models/Board";
import type { Cell } from "../models/Cell";
import type { figureColor } from "../models/Colors";
import type { Figure } from "../models/Figures/Figure";

export type FigureCtor = new (id:number, color:figureColor, cell:Cell) => Figure;

let nextId = 1;

export function emptyBoard(): Board {
    const board = new Board(1);
    board.initCells();
    return board;
}

export function place(board:Board, Ctor:FigureCtor, color:figureColor, x:number, y:number): Figure {
    const cell = board.getCell(x, y);
    const figure = new Ctor(nextId++, color, cell);
    cell.cellFigure = figure;
    return figure;
}

export function legal(board:Board, fromX:number, fromY:number, toX:number, toY:number): boolean {
    return board.isMoveLegal(board.getCell(fromX, fromY), board.getCell(toX, toY));
}

export function move(board:Board, fromX:number, fromY:number, toX:number, toY:number): void {
    board.moveFigure(board.getCell(fromX, fromY), board.getCell(toX, toY));
}
