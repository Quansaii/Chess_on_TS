import './App.css'
import {useState} from 'react';
import { Board } from './models/Board';
import type { Cell } from './models/Cell';

function App() {

  const [chessBoard] = useState(() => {
    const newBoard = new Board(1);
    newBoard.initCells();
    newBoard.addFigures();

    return newBoard;
  })

  const [, setTick] = useState(0);

  function handleClick(cell: Cell){
    if(chessBoard.selectedCell && cell.isAvailable){
      chessBoard.moveFigure(chessBoard.selectedCell, cell);
    } else {
      chessBoard.selectCell(cell);
    }
    setTick(t => t+1);
  }

  return (
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
  )
}

export default App
