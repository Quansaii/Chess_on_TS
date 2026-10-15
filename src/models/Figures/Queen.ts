import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";
import type { Cell } from "../Cell";

export class Queen extends Figure{
    name = figureName.QUEEN;
    points = figurePoints.QUEEN;
    img = this.color == "white" ? images.whiteQueen : images.blackQueen;

    public canMove(targetCell:Cell):boolean{
        const dx = targetCell.x - this.cell.x;
        const dy = targetCell.y - this.cell.y;

        if(!((dx === 0 || dy === 0) || (Math.abs(dx) === Math.abs(dy)))){
            return false;
        }

        if(dx === 0 && !this.cell.isEmptyVertical(targetCell)){
            return false;
        }
        if(dy === 0 && !this.cell.isEmptyHorizontal(targetCell)){
            return false;
        }

        if(!this.cell.isEmptyDiagonal(targetCell) && (Math.abs(dx) === Math.abs(dy))){
            return false
        }

        return super.canMove(targetCell);
    }
}