import { Figure, figureName, figurePoints } from "./Figure";
import * as images from "../../assets/index";


export class Rook extends Figure{
    name = figureName.ROOK
    points = figurePoints.ROOK;
    img = this.color == "white" ? images.whiteRook : images.blackRook;
}