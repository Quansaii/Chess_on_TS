import type { Cell } from "../Cell";
import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";

export class Pawn extends Figure{
    name = figureName.PAWN;
    points = figurePoints.PAWN;
    img = this.color == "white" ? images.whitePawn : images.blackPawn;

    public canMove(targetCell:Cell):boolean{
        const dir = this.color === "white" ? -1 : 1;
        const dx = targetCell.x - this.cell.x;
        const dy = targetCell.y - this.cell.y;

        if(dy === 0 && dx === dir){
            return this.cell.isEmpty(targetCell);
        }

        if(dy === 0 && dx === 2*dir && !this.isMoved){
            const middleCell = this.cell.board.getCell(this.cell.x + dir, this.cell.y);
            return this.cell.isEmpty(middleCell) && this.cell.isEmpty(targetCell);
        }

        if(Math.abs(dy) === 1 && dx === dir){
            return this.cell.isEnemy(targetCell) && super.canMove(targetCell);
        }

        return false;
    }
}