import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";
import type { Cell } from "../Cell";


export class Rook extends Figure{
    name = figureName.ROOK
    points = figurePoints.ROOK;
    img = this.color == "white" ? images.whiteRook : images.blackRook;


    public canMove(targetCell:Cell):boolean{
        const dx = targetCell.x - this.cell.x;
        const dy = targetCell.y - this.cell.y;

        if(dx !== 0 && dy !== 0){
            return false;
        }

        if(dx === 0 && !this.cell.isEmptyVertical(targetCell)){
            return false;
        }
        if(dy === 0 && !this.cell.isEmptyHorizontal(targetCell)){
            return false;
        }

        return super.canMove(targetCell);
    }
}