import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { generateBoard } from '../utils/gameLogic';
import './Board.css';
import confetti from 'canvas-confetti';
import backgroundImage from '../assets/backy.jpeg'; // ✅ Import image

const Board = () => {
  const rows = 10;
  const cols = 10;
  const mines = 10;

  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [flagCount, setFlagCount] = useState(0);

  useEffect(() => {
    const newBoard = generateBoard(rows, cols, mines);
    setBoard(newBoard);
  }, []);

  const handleClick = (row, col) => {
    if (gameOver) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const clickedCell = newBoard[row][col];

    if (clickedCell.isRevealed) return;

    if (flagMode) {
      clickedCell.isFlagged = !clickedCell.isFlagged;
      setFlagCount(flagCount + (clickedCell.isFlagged ? 1 : -1));
      setBoard(newBoard);
      return;
    }

    if (clickedCell.isFlagged) return;

    if (clickedCell.isMine) {
      revealAllMines(newBoard);
      setBoard(newBoard);
      setGameOver(true);
      setGameResult('loss');
      return;
    }

    clickedCell.isRevealed = true;

    if (clickedCell.adjacentMines === 0) {
      revealNeighbors(row, col, newBoard);
    }

    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setGameOver(true);
      setGameResult('win');
      triggerConfetti();
    }
  };

  const revealNeighbors = (row, col, newBoard) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = newBoard[nr][nc];

        if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
          neighbor.isRevealed = true;

          if (neighbor.adjacentMines === 0) {
            revealNeighbors(nr, nc, newBoard);
          }
        }
      }
    }
  };

  const revealAllMines = (newBoard) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = newBoard[r][c];
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }
    }
  };

  const checkWin = (newBoard) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = newBoard[r][c];
        if (!cell.isRevealed && !cell.isMine) {
          return false;
        }
      }
    }
    return true;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const restartGame = () => {
    const newBoard = generateBoard(rows, cols, mines);
    setBoard(newBoard);
    setGameOver(false);
    setGameResult(null);
    setFlagCount(0);
  };

  return (
    <div
      className="background-wrapper"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="board-container">
        <h1>Minesweepy</h1>
        <div className="controls">
          <button className="flag-toggle-btn" onClick={() => setFlagMode(!flagMode)}>
            {flagMode ? '🚩 Flag Mode On' : '🏳️ Flag Mode Off'}
          </button>
          <div className="status">
            <p>⚠️ Mines: {mines}</p>
            <p>🚩 Flags: {flagCount} / {mines}</p>
          </div>
          {gameOver && (
            <button className="restart-btn" onClick={restartGame}>
              🔄 Restart
            </button>
          )}
        </div>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  cell={cell}
                  onClick={() => handleClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
        {gameOver && (
          <div className="game-status">
            {gameResult === 'win' ? 'You Win! 🎉' : 'Game Over! 😞'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
