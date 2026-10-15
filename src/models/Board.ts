import { Cell } from "./Cell";
import type { figureColor } from "./Colors";
import type { Figure } from "./Figures/Figure";
import { Pawn } from "./Figures/Pawn";
import { Rook } from "./Figures/Rook";
import { Knight } from "./Figures/Knight";
import { Bishop } from "./Figures/Bishop";
import { Queen } from "./Figures/Queen";
import { King } from "./Figures/King";

export class Board{
    readonly id: number;
    cells:Cell[][] = [];
    lostBlackFigures:Figure[] = [];
    lostWhiteFigures:Figure[] = [];
    selectedCell: Cell | null = null;
    whoMoves: figureColor = "white";

    countFiguresId:number = 0;

    constructor(id:number){
        this.id = id;
    }

    public initCells():void{
        let count:number = 0;
        this.cells = [];
        for(let i = 0; i<8; i++){
            const row: Cell[] = []
            for(let j = 0; j<8; j++){
                count++;
                const color = (i+j)%2 === 0 ? 'brown':'beige';
                row.push(new Cell(i,j,color, count, this))
            }
            this.cells.push(row)
        }
    }

    public getCell(x:number, y:number):Cell{
        if(x<0 || x>7 || y<0 || y>7){
            throw new Error("Incorrect Cell!")
        }
        return this.cells[x][y];

    }

    public addFigures():void{
        for(let i = 0; i<8; i++){
            const whitePawnCell = this.getCell(1,i);
            whitePawnCell.setFigure(new Pawn(this.countFiguresId, 'white', whitePawnCell));
            this.countFiguresId++;

            const blackPawnCell = this.getCell(6,i);
            blackPawnCell.setFigure(new Pawn(this.countFiguresId, 'black', blackPawnCell));
            this.countFiguresId++;
        }

        for(const i of [0, 7]){
            const whiteRookCell = this.getCell(0,i);
            whiteRookCell.setFigure(new Rook(this.countFiguresId, 'white', whiteRookCell));
            this.countFiguresId++;

            const blackRookCell = this.getCell(7,i);
            blackRookCell.setFigure(new Rook(this.countFiguresId, 'black', blackRookCell));
            this.countFiguresId++;
        }

        for(const i of [1, 6]){
            const whiteKnightCell = this.getCell(0,i);
            whiteKnightCell.setFigure(new Knight(this.countFiguresId, 'white', whiteKnightCell));
            this.countFiguresId++;

            const blackKnightCell = this.getCell(7,i);
            blackKnightCell.setFigure(new Knight(this.countFiguresId, 'black', blackKnightCell));
            this.countFiguresId++;
        }

        for(const i of [2, 5]){
            const whiteBishopCell = this.getCell(0,i);
            whiteBishopCell.setFigure(new Bishop(this.countFiguresId, 'white', whiteBishopCell));
            this.countFiguresId++;

            const blackBishopCell = this.getCell(7,i);
            blackBishopCell.setFigure(new Bishop(this.countFiguresId, 'black', blackBishopCell));
            this.countFiguresId++;
        }

        const whiteQueenCell = this.getCell(0,3);
        whiteQueenCell.setFigure(new Queen(this.countFiguresId, 'white', whiteQueenCell));
        this.countFiguresId++;

        const blackQueenCell = this.getCell(7,3);
        blackQueenCell.setFigure(new Queen(this.countFiguresId, 'black', blackQueenCell));
        this.countFiguresId++;

        const whiteKingCell = this.getCell(0,4);
        whiteKingCell.setFigure(new King(this.countFiguresId, 'white', whiteKingCell));
        this.countFiguresId++;

        const blackKingCell = this.getCell(7,4);
        blackKingCell.setFigure(new King(this.countFiguresId, 'black', blackKingCell));
        this.countFiguresId++;
    }

    public moveFigure(from:Cell, to:Cell):void{
        const figure = from.cellFigure;
        if(!figure){
            return;
        }
        if(figure.color !== this.whoMoves){
            return
        }
        if(!figure.canMove(to)){
            return;
        }

        if(to.cellFigure !== null){
            to.cellFigure.color === 'white' ? 
                this.lostWhiteFigures.push(to.cellFigure) : this.lostBlackFigures.push(to.cellFigure);
        }

        to.cellFigure = figure;
        from.cellFigure = null;
        figure.cell = to;
        figure.isMoved = true;
        this.whoMoves === 'white' ?
            this.whoMoves = 'black' : this.whoMoves = 'white';
        this.selectedCell = null;
    }

}
