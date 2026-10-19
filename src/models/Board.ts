import { Cell } from "./Cell";
import type { figureColor } from "./Colors";
import { figureName, type Figure } from "./Figures/Figure";
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
    pawnCell: Cell | null = null;
    whoMoves: figureColor = "white";
    enPassantTarget: Cell | null = null;

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
                const color = (i+j)%2 === 0 ? 'beige':'brown';
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
            const whitePawnCell = this.getCell(6,i);
            whitePawnCell.setFigure(new Pawn(this.countFiguresId, 'white', whitePawnCell));
            this.countFiguresId++;

            const blackPawnCell = this.getCell(1,i);
            blackPawnCell.setFigure(new Pawn(this.countFiguresId, 'black', blackPawnCell));
            this.countFiguresId++;
        }

        for(const i of [0, 7]){
            const whiteRookCell = this.getCell(7,i);
            whiteRookCell.setFigure(new Rook(this.countFiguresId, 'white', whiteRookCell));
            this.countFiguresId++;

            const blackRookCell = this.getCell(0,i);
            blackRookCell.setFigure(new Rook(this.countFiguresId, 'black', blackRookCell));
            this.countFiguresId++;
        }

        for(const i of [1, 6]){
            const whiteKnightCell = this.getCell(7,i);
            whiteKnightCell.setFigure(new Knight(this.countFiguresId, 'white', whiteKnightCell));
            this.countFiguresId++;

            const blackKnightCell = this.getCell(0,i);
            blackKnightCell.setFigure(new Knight(this.countFiguresId, 'black', blackKnightCell));
            this.countFiguresId++;
        }

        for(const i of [2, 5]){
            const whiteBishopCell = this.getCell(7,i);
            whiteBishopCell.setFigure(new Bishop(this.countFiguresId, 'white', whiteBishopCell));
            this.countFiguresId++;

            const blackBishopCell = this.getCell(0,i);
            blackBishopCell.setFigure(new Bishop(this.countFiguresId, 'black', blackBishopCell));
            this.countFiguresId++;
        }

        const whiteQueenCell = this.getCell(7,3);
        whiteQueenCell.setFigure(new Queen(this.countFiguresId, 'white', whiteQueenCell));
        this.countFiguresId++;

        const blackQueenCell = this.getCell(0,3);
        blackQueenCell.setFigure(new Queen(this.countFiguresId, 'black', blackQueenCell));
        this.countFiguresId++;

        const whiteKingCell = this.getCell(7,4);
        whiteKingCell.setFigure(new King(this.countFiguresId, 'white', whiteKingCell));
        this.countFiguresId++;

        const blackKingCell = this.getCell(0,4);
        blackKingCell.setFigure(new King(this.countFiguresId, 'black', blackKingCell));
        this.countFiguresId++;
    }

    public moveFigure(from:Cell, to:Cell):void{

        if(this.pawnCell !== null){
            return;
        }

        const figure = from.cellFigure;
        if(!figure){
            return;
        }
        if(figure.color !== this.whoMoves){
            return;
        }
        if(!figure.canMove(to)){
            return;
        }

        if(to.cellFigure !== null){
            this.addLostFigure(to.cellFigure);
        }

        if(this.isEnPassantCapture(figure, from, to)){
            this.captureEnPassant(from, to);
        }

        to.cellFigure = figure;
        from.cellFigure = null;
        figure.cell = to;
        figure.isMoved = true;

        if(figure.name === figureName.PAWN && Math.abs(to.x - from.x) === 2){
            this.enPassantTarget = this.getCell((from.x + to.x)/2, to.y);
        }
        else{
            this.enPassantTarget = null;
        }

        if(figure.name === figureName.PAWN){
            if(figure.color === 'white' && to.x === 0 || figure.color === 'black' && to.x === 7){
                this.pawnCell = to;
                this.selectedCell = null;
                this.updateAvailableCells();
                return;
            }
        }

        this.endTurn();
        this.updateAvailableCells();
    }

    private addLostFigure(figure:Figure):void{
        if(figure.color === "white"){
            this.lostWhiteFigures.push(figure);
        } else {
            this.lostBlackFigures.push(figure);
        }
    }

    private isEnPassantCapture(figure:Figure, from:Cell, to:Cell):boolean{
        return figure.name === figureName.PAWN
            && to === this.enPassantTarget
            && from.y !== to.y;
    }

    private captureEnPassant(from:Cell, to:Cell):void{
        const passedCell = this.getCell(from.x, to.y);
        if(passedCell.cellFigure){
            this.addLostFigure(passedCell.cellFigure);
            passedCell.cellFigure = null;
        }
    }

    public selectCell(cell:Cell):void{

        if(this.pawnCell !== null){
            return;
        }

        if(this.selectedCell === cell){
            this.selectedCell = null;
            return;
        }

        if(!cell.cellFigure || cell.cellFigure.color !== this.whoMoves){
            this.selectedCell = null;
            return;
        }

        this.selectedCell = cell;
        this.updateAvailableCells();
    }

    public updateAvailableCells():void{
        this.cells.forEach((row) => {
            row.forEach((column) => {
                column.isAvailable = false;
            })
        });

        if(this.selectedCell === null){
            return;
        }

        const figure = this.selectedCell.cellFigure;

        if(!figure){
            return;
        }

        this.cells.forEach((row) => {
            row.forEach((column) => {
                if(figure.canMove(column)){
                    column.isAvailable = true;
                }
            })
        })
    }

    public endTurn():void{
        this.whoMoves === 'white' ?
            this.whoMoves = 'black' : this.whoMoves = 'white';
        this.selectedCell = null;
    }

    public promotePawn(type:"QUEEN" | "ROOK" | "BISHOP" | "KNIGHT"):void{
        const cell = this.pawnCell;
        if(cell === null){
            return;
        }

        const pawn = cell.cellFigure;
        if(!pawn){
            return;
        }

        let newFigure: Figure;
        switch(type){
            case "QUEEN":
                newFigure = new Queen(pawn.id, pawn.color, cell);
                break;
            case "ROOK":
                newFigure = new Rook(pawn.id, pawn.color, cell);
                break;
            case "BISHOP":
                newFigure = new Bishop(pawn.id, pawn.color, cell);
                break;
            case "KNIGHT":
                newFigure = new Knight(pawn.id, pawn.color, cell);
                break;
        }

        cell.cellFigure = newFigure;
        newFigure.isMoved = true;
        this.pawnCell = null;
        this.endTurn();
        this.updateAvailableCells();
    }

    public isSquareAttacked(target:Cell, byColor:figureColor):boolean{
    return this.cells.flat().some((cell) => {
        const figure = cell.cellFigure;
        return figure !== null && figure.color === byColor && figure.attacks(target);
    });
}
}
