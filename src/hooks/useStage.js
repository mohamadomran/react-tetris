import { useState, useEffect } from "react";
import { createStage, checkCollision } from "../gameHelpers";

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsClear, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = newStage =>
      newStage.reduce((ack, row) => {
        if (row.findIndex(cell => cell[0] === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          return ack;
        }
        ack.push(row);
        return ack;
      }, []);

    const updateStage = prevStage => {
      //First flush the stage
      const newStage = prevStage.map(row =>
        row.map(cell => (cell[1] === "clear" || cell[1] === "ghost" ? [0, "clear"] : cell))
      );

      // Calculate ghost position (where piece will land)
      let ghostY = player.pos.y;
      while (!checkCollision(player, newStage, { x: 0, y: ghostY - player.pos.y + 1 })) {
        ghostY++;
      }

      //Draw the ghost piece (if different from current position)
      if (ghostY !== player.pos.y && !player.collided) {
        player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              const ghostYPos = y + ghostY;
              const xPos = x + player.pos.x;
              if (ghostYPos >= 0 && ghostYPos < newStage.length && xPos >= 0 && xPos < newStage[0].length) {
                newStage[ghostYPos][xPos] = [value, "ghost"];
              }
            }
          });
        });
      }

      //Then draw the active tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`
            ];
          }
        });
      });
      //Then we check if collided
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage(prev => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsClear];
};
