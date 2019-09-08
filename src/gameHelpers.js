export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

/* Multi-dimensional array represents the grid,
/* I'm creating an array with the default dimensions from
/* STAGE_WIDTH & STAGE__HEIGHT.
/* I'm supplying an inline function that for reach row
/ create a new array with our cells, and we're filling them up
/* with number 0 (i.e a clean cell) and string clear (i.e no tetraminos collided in the cell and 
/* must wiped in the next stage in the next render)
*/

export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, "clear"])
  );

export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[0].length; x++) {
      //1.Check that we're on an actual tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          //2.Check that our move is inside the game areas heights (y)
          //we shouldn't go through the bottom of the play area
          !stage[y + player.pos.y + moveY] ||
          //3.Check that our move is inside the game areas width (x)
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          //4.Check that the cell we're moving to isn't set to clear
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            "clear"
        ) {
          return true;
        }
      }
    }
  }
};
