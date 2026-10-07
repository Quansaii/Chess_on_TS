import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";

export class Queen extends Figure{
    name = figureName.QUEEN;
    points = figurePoints.QUEEN;
    img = this.color == "white" ? images.whiteQueen : images.blackQueen;
}