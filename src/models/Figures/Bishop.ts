import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";


export class Bishop extends Figure{
    name = figureName.BISHOP;
    points = figurePoints.BISHOP;
    img = this.color == "white" ? images.whiteBishop : images.blackBishop;
}