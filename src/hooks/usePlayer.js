import { useState, useCallback } from "react";

import { TETROMINOS, randomTetromino } from "../tetrominos";
import { STAGE_WIDTH, checkCollision } from "../gameHelpers";

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false
  });

  const [currentPieceObj, setCurrentPieceObj] = useState(TETROMINOS[0]);
  const [nextPiece, setNextPiece] = useState(TETROMINOS[0]);

  const rotate = (matrix, dir) => {
    //Make rows -> columns (transpose of the matrix)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map(col => col[index])
    );
    //Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map(row => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage, dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player)); //Shouldn't mutate the state
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided
    }));
  };

  const resetPlayer = useCallback(
    (isInitialReset = false, pieceToUse = null) => {
      // If pieceToUse is provided (from hold), use it; otherwise use normal logic
      const currentPiece = pieceToUse
        ? pieceToUse
        : isInitialReset
        ? randomTetromino()
        : nextPiece;
      const newNextPiece = pieceToUse ? nextPiece : randomTetromino();

      setPlayer({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        tetromino: currentPiece.shape,
        collided: false
      });

      setCurrentPieceObj(currentPiece);
      if (!pieceToUse) {
        setNextPiece(newNextPiece);
      }
    },
    [nextPiece]
  );

  return [player, updatePlayerPos, resetPlayer, playerRotate, nextPiece, currentPieceObj];
};
