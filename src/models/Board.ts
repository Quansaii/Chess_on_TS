import { Cell } from "./Cell";
import type { figureColor } from "./Colors";
import { figureName, figurePoints, type Figure } from "./Figures/Figure";
import { Pawn } from "./Figures/Pawn";

export class Board{
    readonly id: number;
    cells:Cell[][] = [];
    lostBlackFigures:Figure[] = [];
    lostWhiteFigures:Figure[] = [];
    selectedCell: Cell | null = null;
    whoMoves: figureColor = "white";

    constructor(id:number){
        this.id = id;
    }

    public initCells():void{
        this.cells = [];
        let count:number = 0;
        for(let i = 0; i<8; i++){
            const row: Cell[] = []
            for(let j = 0; j<8; j++){
                count++;
                const color = count%2 === 0 ? 'beige':'brown';
                row.push(new Cell(i,j,color, count, this))
            }
            this.cells.push(row)
        }
    }

    public getCell(x:number, y:number):Cell{
        if(((x-1) | (8-x) | (y-1) | (8-y)) < 0){
            throw new Error("Incorrect Cell!")
        }
        return this.cells[x][y];

    }

    public addFigures():void{
        
    }

}