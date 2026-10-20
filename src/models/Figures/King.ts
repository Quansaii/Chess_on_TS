import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";
import type { Cell } from "../Cell";


export class King extends Figure{
    name = figureName.KING;
    points = figurePoints.KING;
    img = this.color == "white" ? images.whiteKing : images.blackKing;
    
    public canMove(targetCell:Cell):boolean{
        const dx = Math.abs(targetCell.x - this.cell.x);
        const dy = Math.abs(targetCell.y - this.cell.y);

        if(dx === 0 && dy === 2){
            return this.cell.board.canCastle(this.cell, targetCell);
        }

        if(dx > 1 || dy > 1){
            return false;
        }

        if(dx === 0 && dy === 0){
            return false;
        }

        return super.canMove(targetCell);
    }

    public attacks(targetCell:Cell):boolean{
        const dx = Math.abs(targetCell.x - this.cell.x);
        const dy = Math.abs(targetCell.y - this.cell.y);

        if((dx <= 1 && dy <= 1) && targetCell !== this.cell){
            return true;
        }

        return super.attacks(targetCell);
    }
}