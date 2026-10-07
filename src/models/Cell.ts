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
        if(this.y < targetCell.y){
            for(let i = this.y+1; i<= targetCell.y; i++){
                if(!this.isEmpty(this.board.getCell(this.x, i))){
                    return false;
                }
            }
        }
        else{
            for(let i = this.y+1; i>= targetCell.y; i--){
                if(!this.isEmpty(this.board.getCell(this.x, i))){
                    return false;
                }
            }
        }
        return true
    }

    public isEmptyHorizontal(targetCell:Cell): boolean{
        if(this.x < targetCell.x){
            for(let i = this.x + 1; i<=targetCell.x; i++){
               if(!this.isEmpty(this.board.getCell(i, this.y))){
                    return false;
            }
        }
        }
        else{
            for(let i = this.x + 1; i>=targetCell.x; i--){
                if(!this.isEmpty(this.board.getCell(i, this.y))){
                    return false;
                }
            }
        }

        return true;
    }

    public isEmptyDiagonal(targetCell:Cell): boolean{
        if(this.x + this.y < targetCell.x + targetCell.y){
            for(let i = this.x + 1; i<=targetCell.x; i++){
                if(!this.isEmpty(this.board.getCell(i,i))){
                    return false;
                }
            }
        }
        else{
            for(let i = this.x + 1; i>=targetCell.x; i--){
                if(!this.isEmpty(this.board.getCell(i,i))){
                    return false;
                }
            }
        }

        return true;
    }
    public setFigure(figure:Figure):void{
        this.cellFigure = figure;
    }

    public moveFigure(targetCell:Cell):void{
        if(this.isEmpty(targetCell)){
            this.board.getCell(targetCell.x, targetCell.y).cellFigure = this.cellFigure;
        }
    }
}