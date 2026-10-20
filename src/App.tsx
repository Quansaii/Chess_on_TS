import './App.css'
import {useState} from 'react';
import { Board } from './models/Board';
import type { Cell } from './models/Cell';
import * as images from './assets/index';
import type { Figure } from './models/Figures/Figure';

const promotionOptions = [
  { type: "QUEEN", label: "Ферзь", white: images.whiteQueen, black: images.blackQueen },
  { type: "ROOK", label: "Ладья", white: images.whiteRook, black: images.blackRook },
  { type: "BISHOP", label: "Слон", white: images.whiteBishop, black: images.blackBishop },
  { type: "KNIGHT", label: "Конь", white: images.whiteKnight, black: images.blackKnight },
] as const;

function createBoard(): Board {
  const newBoard = new Board(1);
  newBoard.initCells();
  newBoard.addFigures();
  return newBoard;
}

function App() {

  const [chessBoard, setChessBoard] = useState(createBoard);

  const [, setTick] = useState(0);

  function handleClick(cell: Cell){
    if(chessBoard.pawnCell !== null || chessBoard.gameStatus !== "playing"){
      return;
    }
    if(chessBoard.selectedCell && cell.isAvailable){
      chessBoard.moveFigure(chessBoard.selectedCell, cell);
    } else {
      chessBoard.selectCell(cell);
    }
    setTick(t => t+1);
  }

  function handlePromotion(type: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT"){
    chessBoard.promotePawn(type);
    setTick(t => t+1);
  }

  function handleNewGame(){
    setChessBoard(createBoard());
  }

  function lostFiguresImages(figures:Figure[]){
    return figures.map((figure) =>{
      return (
        <img className='captured' src={figure.img} alt={figure.name} key={figure.id}/>
      )
    })
  }

  const promotionCell = chessBoard.pawnCell;
  const side = chessBoard.whoMoves;
  const isGameOver = chessBoard.gameStatus !== "playing";
  const isMate = chessBoard.gameStatus === "checkmate";
  const inCheck = !isGameOver && chessBoard.isInCheck(side);
  const kingCell = inCheck || isMate ? chessBoard.findKing(side) : null;

  const winnerName = side === "white" ? "Чёрные" : "Белые";

  return (
    <>
    {promotionCell && (
      <div className="promotion">
        <p>Выберите фигуру</p>
        <div className="promotion-options">
          {promotionOptions.map((option) => (
            <button
              key={option.type}
              title={option.label}
              onClick={() => handlePromotion(option.type)}
            >
              <img
                src={promotionCell.cellFigure?.color === "black" ? option.black : option.white}
                alt={option.label}
              />
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="game">
      <div className="player-row">
        <div className={`player ${!isGameOver && side === "black" ? "active" : ""}`}>Чёрные</div>
        <div className="captured-list">{lostFiguresImages(chessBoard.lostWhiteFigures)}</div>
      </div>
      
      <div className="board-container">
        <div className="board">
          {chessBoard.cells.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell) => {
                const highlight = cell === kingCell ? (isMate ? " checkmate" : " in-check") : "";
                return (
                  <div
                    key={cell.id}
                    className={`cell ${cell.color}${cell.isAvailable ? " available" : ""}${highlight}`}
                    onClick={() => handleClick(cell)}
                  >
                    {cell.cellFigure && <img src={cell.cellFigure.img} alt={cell.cellFigure.name} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isGameOver && (
          <div className="result-overlay">
            <div className="result-box">
              {isMate ? (
                <>
                  <h2>Мат</h2>
                  <p>{winnerName} победили</p>
                </>
              ) : (
                <>
                  <h2>Пат</h2>
                  <p>Ничья</p>
                </>
              )}
              <button onClick={handleNewGame}>Новая партия</button>
            </div>
          </div>
        )}
      </div>

      <div className="player-row">
        <div className={`player ${!isGameOver && side === "white" ? "active" : ""}`}>Белые</div>
        <div className="captured-list">{lostFiguresImages(chessBoard.lostBlackFigures)}</div>
      </div>
    </div>
    </>
  )
}

export default App
