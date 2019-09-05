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

export const createStage = () => {
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, "clear"])
  );
};
