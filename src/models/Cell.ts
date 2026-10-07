import type { Board } from "./Board";
import type { cellColor } from "./Colors";
import type { Figure } from "./Figures/Figure";

export class Cell{
    public x:number;
    public y:number;
    public isAvailable:boolean = false;
    public color: cellColor;
    public id:number;
    public cellFigure:Figure | null = null;
    public readonly board:Board;


    constructor (x:number, y:number, color:cellColor, id:number, board:Board){
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.board = board
    }

    public isEmpty(targetCell:Cell):boolean{
        if(targetCell.cellFigure){
            return false;
        }
        return true;
    }

    public isEnemy(targetCell:Cell):boolean{
        if(targetCell.cellFigure?.color !== this.cellFigure?.color){
            return true;
        }
        return false;
    }

    public isEmptyVertical(targetCell:Cell): boolean{
        return false
    }
    
}