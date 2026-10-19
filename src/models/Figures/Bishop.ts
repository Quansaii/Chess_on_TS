import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";
import type { Cell } from "../Cell";


export class Bishop extends Figure{
    name = figureName.BISHOP;
    points = figurePoints.BISHOP;
    img = this.color == "white" ? images.whiteBishop : images.blackBishop;

    public canMove(targetCell:Cell):boolean{
        const dx = Math.abs(targetCell.x - this.cell.x);
        const dy = Math.abs(targetCell.y - this.cell.y);
        
        if(dx !== dy){
            return false;
        }

        if(!this.cell.isEmptyDiagonal(targetCell)){
            return false
        }

        return super.canMove(targetCell);
    }

    public attacks(targetCell:Cell):boolean{
        const dx = Math.abs(targetCell.x - this.cell.x);
        const dy = Math.abs(targetCell.y - this.cell.y);
        
        if(dx !== dy){
            return false;
        }

        if(this.cell.isEmptyDiagonal(targetCell)){
            return true;
        }

        return super.attacks(targetCell);
    }
}