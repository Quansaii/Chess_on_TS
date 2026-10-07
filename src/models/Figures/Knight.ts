import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";

export class Knight extends Figure{
    name = figureName.KNIGHT;
    points = figurePoints.KNIGHT;
    img = this.color == "white" ? images.whiteKnight : images.blackKnight;
}