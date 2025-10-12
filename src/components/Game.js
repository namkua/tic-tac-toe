import React, { useState, useEffect } from "react";
import Board from "./Board";

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }

  if (!squares.includes(null)) {
    return 'Draw';
  }

  return null;
};

const minimax = (board, depth, isMaximizing) => {
  const winner = calculateWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return -10 + depth;
  if (winner === "Draw") return 0;

  if (isMaximizing) { // AI turn
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "O";
        const evalScore = minimax(newBoard, depth + 1, false);
        maxEval = Math.max(maxEval, evalScore);
      }
    }
    return maxEval;
  } else { // Player turn
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = "X";
        const evalScore = minimax(newBoard, depth + 1, true);
        minEval = Math.min(minEval, evalScore);
      }
    }
    return minEval;
  }
};

const getBestMove = (board) => {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {          // only consider empty cells
      const newBoard = [...board];
      newBoard[i] = "O";      // simulate AI move
      const score = minimax(newBoard, 0, false); // next turn is player
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move; // return the best index for AI to play
};


function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!xIsNext) {
      const bestMove = getBestMove(squares);  // find best index
      if (bestMove !== null) {
        const newBoard = [...squares];
        newBoard[bestMove] = "O";
        setSquares(newBoard);
        setXIsNext(!xIsNext);
      }
    }
  }, [xIsNext]);

  //Declaring a Winner
  useEffect(() => {
    setWinner(calculateWinner(squares));
  }, [squares]);


  //Handle player
  const handleClick = (i) => {
    if (winner || squares[i]) {
      return;
    }

    squares[i] = 'X';
    setXIsNext(!xIsNext);
    setSquares([...squares]);
  };

  //Restart game
  const handlRestart = () => {
    setWinner(null);
    setXIsNext(true);
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="main">
      <h2 className="result">Winner is: {winner ? winner : "N/N"}</h2>
      <div className="game">
        <span className="player">Next player is: {xIsNext ? "X" : "O"}</span>
        <Board squares={squares} handleClick={handleClick} />
      </div>
      <button onClick={handlRestart} className="restart-btn">
        Restart
      </button>
    </div>
  );
}

export default Game;
