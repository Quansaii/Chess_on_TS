import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";

export class King extends Figure{
    name = figureName.KING;
    points = figurePoints.KING;
    img = this.color == "white" ? images.whiteKing : images.blackKing;
}