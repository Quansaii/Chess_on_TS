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
        if(this.cellFigure === null){
            throw new Error("This cell has no Figure!");
        }
        if(targetCell.cellFigure?.color !== this.cellFigure?.color && !this.isEmpty(targetCell)){
            return true;
        }
        return false;
    }

    public isEmptyVertical(targetCell:Cell): boolean{
        if(this.y < targetCell.y){
            for(let i = this.y+1; i < targetCell.y; i++){
                if(!this.isEmpty(this.board.getCell(this.x, i))){
                    return false;
                }
            }
        }
        else{
            for(let i = this.y-1; i > targetCell.y; i--){
                if(!this.isEmpty(this.board.getCell(this.x, i))){
                    return false;
                }
            }
        }
        return true
    }

    public isEmptyHorizontal(targetCell:Cell): boolean{
        if(this.x < targetCell.x){
            for(let i = this.x + 1; i<targetCell.x; i++){
               if(!this.isEmpty(this.board.getCell(i, this.y))){
                    return false;
                }
            }
        }
        else{
            for(let i = this.x - 1; i>targetCell.x; i--){
                if(!this.isEmpty(this.board.getCell(i, this.y))){
                    return false;
                }
            }
        }

        return true;
    }

    public isEmptyDiagonal(targetCell:Cell): boolean{
        const absX = Math.abs(targetCell.x - this.x);
        const absY = Math.abs(targetCell.y - this.y);
        if(absX !== absY || absX === 0){
            return false;
        }

        const dx = targetCell.x > this.x ? 1 : -1;
        const dy = targetCell.y > this.y ? 1 : -1;

        for(let k = 1; k < absX; k++){
            if(!this.isEmpty(this.board.getCell(this.x + k*dx, this.y + k*dy))){
                return false;
            }
        }

        return true;
    }
    
    public setFigure(figure:Figure):void{
        this.cellFigure = figure;
    }

    public moveFigure(targetCell:Cell):void{
        const figure = this.cellFigure;
        if(!figure){
            return;
        }
        if(this.isEmpty(targetCell) || this.isEnemy(targetCell)){
            const target = this.board.getCell(targetCell.x, targetCell.y);
            target.cellFigure = figure;
            this.cellFigure = null;
            figure.cell = target;
            figure.isMoved = true;
        }
    }
}