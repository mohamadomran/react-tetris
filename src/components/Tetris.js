import React, { useState, useEffect } from "react";

import { createStage, checkCollision } from "../gameHelpers";

//Styled Components
import {
  StyledTetrisWrapper,
  StyledTetris
} from "./styles/StyledTetrisWrapper";

//Custom Hooks
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useInterval } from "../hooks/useInterval";
import { useGameStatus } from "../hooks/useGameStatus";

// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import Preview from "./Preview";

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [savedDropTime, setSavedDropTime] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [heldPiece, setHeldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);

  const [player, updatePlayerPos, resetPlayer, playerRotate, nextPiece, currentPieceObj] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("tetris-highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("tetris-highScore", score.toString());
    }
  }, [score, highScore]);

  console.log("re-render");

  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 }))
      updatePlayerPos({ x: dir, y: 0 });
  };

  const startGame = () => {
    //Reset Everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer(true); // true = initial reset, generates both current and next piece
    setGameOver(false);
    setPaused(false);
    setHeldPiece(null);
    setCanHold(true);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const togglePause = () => {
    if (gameOver || dropTime === null) return; // Can't pause if game hasn't started or is over

    if (!paused) {
      // Pausing: save current drop time and stop the game
      setSavedDropTime(dropTime);
      setDropTime(null);
      setPaused(true);
    } else {
      // Unpausing: restore the drop time
      setDropTime(savedDropTime);
      setPaused(false);
    }
  };

  const drop = () => {
    //Increase level when player has cleared 10 rows

    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 }))
      updatePlayerPos({ x: 0, y: 1, collided: false });
    else {
      //Game Over
      if (player.pos.y < 1) {
        console.log("GAME OVER");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver && !paused) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const hardDrop = () => {
    // Move piece down until it collides
    let newY = player.pos.y;
    while (!checkCollision(player, stage, { x: 0, y: newY - player.pos.y + 1 })) {
      newY++;
    }
    // Update position to the landing spot and mark as collided
    updatePlayerPos({ x: 0, y: newY - player.pos.y, collided: true });
  };

  const holdPiece = () => {
    if (!canHold || gameOver || paused || dropTime === null) return;

    if (heldPiece === null) {
      // First time holding - store current piece and spawn next piece
      setHeldPiece(currentPieceObj);
      resetPlayer(false); // Get next piece as current
    } else {
      // Swap current piece with held piece
      const temp = heldPiece;
      setHeldPiece(currentPieceObj);
      resetPlayer(false, temp); // Use held piece as current
    }

    setCanHold(false); // Can't hold again until next piece
  };

  // Reset canHold when player collides (new piece spawns)
  useEffect(() => {
    if (player.collided) {
      setCanHold(true);
    }
  }, [player.collided]);

  const move = ({ keyCode }) => {
    // Handle pause key (P or Escape) separately
    if (keyCode === 80 || keyCode === 27) {
      togglePause();
      return;
    }

    // Prevent all movements when game is over or paused
    if (!gameOver && !paused) {
      if (keyCode === 37) movePlayer(-1); // Left arrow
      else if (keyCode === 39) movePlayer(1); // Right arrow
      else if (keyCode === 40) dropPlayer(); // Down arrow (soft drop)
      else if (keyCode === 38) playerRotate(stage, 1); // Up arrow (rotate)
      else if (keyCode === 32) hardDrop(); // Spacebar (hard drop)
      else if (keyCode === 67) holdPiece(); // C key (hold piece)
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              {paused && <Display text="PAUSED" />}
              <Display text={`Score: ${score}`} />
              <Display text={`High Score: ${highScore}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          {!gameOver && heldPiece && heldPiece.shape && (
            <div>
              <Display text="Hold:" />
              <Preview nextPiece={heldPiece} />
            </div>
          )}
          {!gameOver && nextPiece && nextPiece.shape && (
            <div>
              <Display text="Next:" />
              <Preview nextPiece={nextPiece} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
