import React from 'react';
import './Cell.css';

const Cell = ({ cell, onClick }) => {
  const { isRevealed, isMine, adjacentMines, isFlagged } = cell;

  let cellClass = 'cell';
  if (isRevealed) {
    cellClass += ' revealed';
    if (isMine) cellClass += ' mine';
    else if (adjacentMines > 0) cellClass += ` number-${adjacentMines}`;
  } else if (isFlagged) {
    cellClass += ' flagged';
  } else {
    cellClass += ' unrevealed';
  }

  let cellContent = null;
  if (isRevealed) {
    if (isMine) {
      cellContent = '💣';
    } else if (adjacentMines > 0) {
      cellContent = adjacentMines;
    }
  } else if (isFlagged) {
    // Display flag when the cell is flagged
    cellContent = '🚩';
  }

  return (
    <div
      className={cellClass}
      onClick={onClick}
    >
      {cellContent}
    </div>
  );
};

export default Cell;
