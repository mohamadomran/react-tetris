import React from "react";
import { StyledPreview } from "./styles/StyledPreview";
import Cell from "./Cell";

const Preview = ({ nextPiece }) => {
  return (
    <StyledPreview width={nextPiece.shape[0].length} height={nextPiece.shape.length}>
      {nextPiece.shape.map((row, y) =>
        row.map((cell, x) => <Cell key={x} type={cell} />)
      )}
    </StyledPreview>
  );
};

export default Preview;
