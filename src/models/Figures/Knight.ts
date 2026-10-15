import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";
import type { Cell } from "../Cell";

export class Knight extends Figure{
    name = figureName.KNIGHT;
    points = figurePoints.KNIGHT;
    img = this.color == "white" ? images.whiteKnight : images.blackKnight;

    public canMove(targetCell:Cell):boolean{
        const dx = Math.abs(targetCell.x - this.cell.x);
        const dy = Math.abs(targetCell.y - this.cell.y);
        
        if(!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))){
            return false;
        }

        return super.canMove(targetCell);
    }
}