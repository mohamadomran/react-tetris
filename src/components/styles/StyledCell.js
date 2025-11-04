import styled from "styled-components";

export const StyledCell = styled.div`
  width: auto;
  background: rgba(${props => props.color}, ${props => props.status === "ghost" ? 0.2 : 0.8});
  border: ${props => (props.type === 0 ? "0px solid" : props.status === "ghost" ? "2px dashed" : "4px solid")};
  border-bottom-color: rgba(${props => props.color}, ${props => props.status === "ghost" ? 0.2 : 0.1});
  border-right-color: rgba(${props => props.color}, ${props => props.status === "ghost" ? 0.3 : 1});
  border-top-color: rgba(${props => props.color}, ${props => props.status === "ghost" ? 0.3 : 1});
  border-left-color: rgba(${props => props.color}, ${props => props.status === "ghost" ? 0.2 : 0.3});
`;
