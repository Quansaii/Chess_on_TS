import type { Cell } from "../Cell";
import type { figureColor } from "../Colors";


export const figureName = {
    KING:"KING",
    QUEEN:"QUEEN",
    BISHOP:"BISHOP",
    ROOK:"ROOK",
    KNIGHT:"KNIGHT",
    PAWN:"PAWN"
} as const;

type FigureName = typeof figureName[keyof typeof figureName]

export const figurePoints = {
    PAWN:1,
    KNIGHT:3,
    ROOK:5,
    BISHOP:3,
    QUEEN:9,
    KING: 0
} as const;

export abstract class Figure{
    id:number;
    color: figureColor;
    cell: Cell;
    isMoved: boolean = false;

    abstract points:number;
    abstract name: FigureName;
    abstract img: string;

    constructor(id:number, color:figureColor, cell:Cell){
        this.id = id;
        this.color = color;
        this.cell = cell;
    }

    public canMove(targetCell:Cell):boolean{
        if(targetCell.cellFigure?.color == this.color){
            return false;
        }

        if(targetCell.cellFigure?.name == 'KING'){
            return false;
        }

        return true;
    }

}