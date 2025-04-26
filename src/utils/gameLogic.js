export const generateBoard = (rows, cols, mines) => {
    const board = [];
  
    // Step 1: Initialize empty board
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      board.push(row);
    }
  
    // Step 2: Place mines randomly
    let placedMines = 0;
    while (placedMines < mines) {
      const randRow = Math.floor(Math.random() * rows);
      const randCol = Math.floor(Math.random() * cols);
      const cell = board[randRow][randCol];
  
      if (!cell.isMine) {
        cell.isMine = true;
        placedMines++;
      }
    }
  
    // Step 3: Calculate adjacent mines for each cell
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1],
    ];
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) continue;
  
        let count = 0;
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
  
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (board[nr][nc].isMine) count++;
          }
        }
  
        board[r][c].adjacentMines = count;
      }
    }
  
    return board;
  };
  