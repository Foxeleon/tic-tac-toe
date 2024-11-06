import React, { useEffect, useState } from 'react';
import './App.css';

interface Square {
  value: 'X' | 'O' | null;
}

class GameBoard {
  private readonly board: Square[];

  constructor(private boardSize: number) {
    this.board = Array(this.boardSize * this.boardSize).fill(null).map(() => ({ value: null }));
  }

  get size(): number {
    return this.boardSize;
  }

  isFull(): boolean {
    return this.board.every(square => square.value !== null);
  }

  mark(player: 'X' | 'O', rowIndex: number, colIndex: number): void {
    const index = rowIndex * this.boardSize + colIndex;
    if (this.board[index].value) {
      throw new Error('Cannot overwrite existing square');
    }
    this.board[index].value = player;
  }

  getSquare(rowIndex: number, colIndex: number): Square {
    return this.board[rowIndex * this.boardSize + colIndex];
  }

  checkWinner(): 'X' | 'O' | 'tie' | null {
    // Check rows and columns
    for (let i = 0; i < this.boardSize; i++) {
      if (this.checkLine(i * this.boardSize, 1, this.boardSize)) {
        return this.board[i * this.boardSize].value;
      }
      if (this.checkLine(i, this.boardSize, this.boardSize)) {
        return this.board[i].value;
      }
    }

    // Check diagonals
    if (this.checkLine(0, this.boardSize + 1, this.boardSize)) {
      return this.board[0].value;
    }
    if (this.checkLine(this.boardSize - 1, this.boardSize - 1, this.boardSize)) {
      return this.board[this.boardSize - 1].value;
    }

    return this.isFull() ? 'tie' : null;
  }

  private checkLine(start: number, step: number, count: number): boolean {
    const value = this.board[start].value;
    if (!value) return false;
    for (let i = 1; i < count; i++) {
      if (this.board[start + i * step].value !== value) {
        return false;
      }
    }
    return true;
  }
}

interface TicTacToeProps {
  onGameOver: (result: 'X' | 'O' | 'tie') => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onGameOver }) => {
  const [board, setBoard] = useState(new GameBoard(3));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');

  useEffect(() => {
    const winner = board.checkWinner();
    if (winner) {
      onGameOver(winner);
    }
  }, [board, onGameOver]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    try {
      const newBoard = new GameBoard(board.size);
      for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
          const square = board.getSquare(i, j);
          if (square.value) {
            newBoard.mark(square.value, i, j);
          }
        }
      }
      newBoard.mark(currentPlayer, rowIndex, colIndex);
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    } catch (error) {
      console.log('Invalid move! Try again.');
    }
  };

  const renderSquare = (rowIndex: number, colIndex: number): JSX.Element => (
      <button className="square" onClick={() => handleSquareClick(rowIndex, colIndex)}>
        {board.getSquare(rowIndex, colIndex).value || ''}
      </button>
  );

  const renderRow = (rowIndex: number): JSX.Element => (
      <div className="board-row" key={rowIndex}>
        {Array.from({ length: board.size }, (_, i) => renderSquare(rowIndex, i))}
      </div>
  );

  return (
      <div className="board">
        {Array.from({ length: board.size }, (_, i) => renderRow(i))}
      </div>
  );
};

const App: React.FC = () => {
  const [gameOver, setGameOver] = useState<'X' | 'O' | 'tie' | null>(null);

  const handleGameOver = (result: 'X' | 'O' | 'tie') => {
    setGameOver(result);
  };

  return (
      <div className="App">
        <h1>Tic-Tac-Toe</h1>
        {!gameOver && <TicTacToe onGameOver={handleGameOver} />}
        {gameOver && (
            <div className="result">
              {gameOver === 'tie' ? "It's a tie!" : `Player ${gameOver} wins!`}
            </div>
        )}
      </div>
  );
};

export default App;