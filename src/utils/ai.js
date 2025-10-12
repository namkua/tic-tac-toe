import { checkWinner, EMPTY, PLAYER, AI } from "./gameLogic";

/**
 * Easy move: random valid position
 * - has 20% chance to pick any random (non-intelligent) move
 */
export function easyMove(board) {
  const avail = board.map((v,i) => (v === EMPTY ? i : -1)).filter(i => i !== -1);
  if (!avail.length) return -1;
  if (Math.random() < 0.2) {
    // intentionally non-optimal random choice
    return avail[Math.floor(Math.random() * avail.length)];
  }
  return avail[Math.floor(Math.random() * avail.length)];
}

/**
 * Hard move: full minimax.
 * - Returns { index, positionsEvaluated, ms }
 * - Logs candidate evaluations for top-level moves (console).
 *
 * Note: For TicTacToe, minimax without alpha-beta is OK (small tree).
 */
export function hardMove(board, verbose = false) {
  let positionsEvaluated = 0;
  const start = performance.now();

  function minimax(curBoard, isMaximizing) {
    positionsEvaluated++;
    const outcome = checkWinner(curBoard);
    if (outcome) {
      if (outcome.winner === AI) return { score: 10 };
      if (outcome.winner === PLAYER) return { score: -10 };
      return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (curBoard[i] === EMPTY) {
        const copy = curBoard.slice();
        copy[i] = isMaximizing ? AI : PLAYER;
        const res = minimax(copy, !isMaximizing);
        moves.push({ index: i, score: res.score });
      }
    }

    if (isMaximizing) {
      let best = moves[0];
      for (const m of moves) if (m.score > best.score) best = m;
      return best;
    } else {
      let best = moves[0];
      for (const m of moves) if (m.score < best.score) best = m;
      return best;
    }
  }

  const candidates = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === EMPTY) {
      const copy = board.slice();
      copy[i] = AI;
      const res = minimax(copy, false);
      candidates.push({ index: i, score: res.score });
      if (verbose) console.log(`Hard AI eval -> move ${i}: score ${res.score}`);
    }
  }

  let bestScore = -Infinity;
  for (const c of candidates) bestScore = Math.max(bestScore, c.score);
  const bestChoices = candidates.filter(c => c.score === bestScore);
  const chosen = bestChoices[Math.floor(Math.random() * bestChoices.length)];

  const ms = Math.round(performance.now() - start);
  return { index: chosen ? chosen.index : -1, positionsEvaluated, ms };
}
