import React, { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import GameInfo from "./components/GameInfo";
import { checkWinner, EMPTY } from "./utils/gameLogic";
import { easyMove, hardMove } from "./utils/ai";
import "./App.css";

const PLAYER = "X"; // human
const AI = "O"; // computer

export default function App() {
  const initialBoard = Array(9).fill(EMPTY);

  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [aiLevel, setAiLevel] = useState(() => localStorage.getItem("ttt_ai") || "hard");
  const [status, setStatus] = useState("Your move");
  const [winLine, setWinLine] = useState(null);
  const [scores, setScores] = useState(() => {
    try {
      const raw = localStorage.getItem("ttt_scores");
      return raw ? JSON.parse(raw) : { player: 0, ai: 0, draw: 0 };
    } catch {
      return { player: 0, ai: 0, draw: 0 };
    }
  });
  const [streak, setStreak] = useState(0);
  const [metrics, setMetrics] = useState({ positionsEvaluated: 0 });
  const [thinking, setThinking] = useState(0);
  const aiThinkingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("ttt_ai", aiLevel);
  }, [aiLevel]);

  useEffect(() => {
    localStorage.setItem("ttt_scores", JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    const outcome = checkWinner(board);
    if (outcome) {
      if (outcome.winner === "draw") {
        setStatus("Draw");
        setWinLine(null);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        setStreak(0);
      } else if (outcome.winner === PLAYER) {
        setStatus("You win!");
        setWinLine(outcome.line);
        setScores((s) => ({ ...s, player: s.player + 1 }));
        setStreak((prev) => (prev >= 0 ? prev + 1 : 1));
      } else if (outcome.winner === AI) {
        setStatus("AI wins");
        setWinLine(outcome.line);
        setScores((s) => ({ ...s, ai: s.ai + 1 }));
        setStreak((prev) => (prev <= 0 ? prev - 1 : -1));
      }
    } else {
      setWinLine(null);
      setStatus(isPlayerTurn ? "Your move" : "AI thinking...");
    }
  }, [board, isPlayerTurn]);

  // AI effect
  useEffect(() => {
    let cancelled = false;
    async function runAi() {
      if (isPlayerTurn) return;
      aiThinkingRef.current = true;

      // small delay for UX
      await new Promise((r) => setTimeout(r, 150));

      if (aiLevel === "easy") {
        const idx = easyMove(board);
        if (idx >= 0 && !cancelled) {
          setBoard((b) => {
            const nb = b.slice();
            nb[idx] = AI;
            return nb;
          });
          setIsPlayerTurn(true);
          setMetrics({ positionsEvaluated: 0 });
          setThinking(50);
        }
      } else {
        // Hard
        const start = performance.now();
        const { index, positionsEvaluated, ms } = hardMove(board, true);
        const took = Math.round(ms || (performance.now() - start));
        if (index >= 0 && !cancelled) {
          setBoard((b) => {
            const nb = b.slice();
            nb[index] = AI;
            return nb;
          });
          setIsPlayerTurn(true);
          setMetrics({ positionsEvaluated });
          setThinking(took);
        } else {
          setMetrics({ positionsEvaluated });
          setThinking(took);
        }
      }

      aiThinkingRef.current = false;
    }

    runAi();
    return () => {
      cancelled = true;
      aiThinkingRef.current = false;
    };
  }, [isPlayerTurn, aiLevel, board]);

  function handlePlay(idx) {
    if (!isPlayerTurn) return;
    if (board[idx] !== EMPTY) return;
    if (checkWinner(board)) return;

    setBoard((b) => {
      const nb = b.slice();
      nb[idx] = PLAYER;
      return nb;
    });
    setIsPlayerTurn(false);
  }

  function newGame() {
    setBoard(Array(9).fill(EMPTY));
    setIsPlayerTurn(true);
    setWinLine(null);
    setMetrics({ positionsEvaluated: 0 });
    setThinking(0);
    setStatus("Your move");
  }

  return (
    <div className="app">
      <div className="container">
        <Board
          board={board}
          onPlay={handlePlay}
          winLine={winLine}
          disabled={!!checkWinner(board) || !isPlayerTurn || aiThinkingRef.current}
        />

        <div>
          <div style={{ marginBottom: 12, fontSize: 20, fontWeight: 700 }}>Tic Tac Toe</div>
          <GameInfo
            status={status}
            onNewGame={newGame}
            aiLevel={aiLevel}
            setAiLevel={setAiLevel}
            scores={scores}
            streak={streak}
            metrics={metrics}
            thinking={thinking}
          />

          <div style={{ marginTop: 12, color: "#8fa8c1", fontSize: 13 }}>
            <div>Turn: {isPlayerTurn ? "Player (X)" : "AI (O)"}</div>
            <div style={{ marginTop: 6 }}>
              Tip: Try switching to Hard and open console to see minimax scores per candidate move.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
