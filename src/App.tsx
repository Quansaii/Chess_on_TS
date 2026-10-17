import './App.css'
import {useState} from 'react';
import { Board } from './models/Board';
import type { Cell } from './models/Cell';
import * as images from './assets/index';

const promotionOptions = [
  { type: "QUEEN", label: "Ферзь", white: images.whiteQueen, black: images.blackQueen },
  { type: "ROOK", label: "Ладья", white: images.whiteRook, black: images.blackRook },
  { type: "BISHOP", label: "Слон", white: images.whiteBishop, black: images.blackBishop },
  { type: "KNIGHT", label: "Конь", white: images.whiteKnight, black: images.blackKnight },
] as const;

function App() {

  const [chessBoard] = useState(() => {
    const newBoard = new Board(1);
    newBoard.initCells();
    newBoard.addFigures();

    return newBoard;
  })

  const [, setTick] = useState(0);

  function handleClick(cell: Cell){
    if(chessBoard.pawnCell !== null){
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

  const promotionCell = chessBoard.pawnCell;


  return (
    <>
    {promotionCell && (
      <div className="promotion">
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
    <div className="board">
      {chessBoard.cells.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell) => (
            <div
              key={cell.id}
              className={`cell ${cell.color}${cell.isAvailable ? ' available' : ''}`}
              onClick={() => handleClick(cell)}
            >
              {cell.cellFigure && <img src={cell.cellFigure.img} alt={cell.cellFigure.name} />}
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  )
}

export default App
