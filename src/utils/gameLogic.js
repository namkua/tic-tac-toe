export const EMPTY = null;
export const PLAYER = "X";
export const AI = "O";

/**
 * checkWinner(board)
 * - board: array length 9 containing 'X' | 'O' | null
 * returns:
 * - null if no winner and not draw
 * - { winner: 'X'|'O'|'draw', line: [a,b,c] } when finished
 */
export function checkWinner(board) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }

  if (board.every(cell => cell !== EMPTY)) {
    return { winner: "draw", line: [] };
  }

  return null;
}
