import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";

export class Pawn extends Figure{
    name = figureName.PAWN;
    points = figurePoints.PAWN;
    img = this.color == "white" ? images.whitePawn : images.blackPawn;
}