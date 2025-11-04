import React from "react";
import { StyledCell } from "./styles/StyledCell";
import { TETROMINOS } from "../tetrominos";

const Cell = ({ type, status }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} status={status} />
);

export default React.memo(Cell);
//To prevent useless re-renders
