import { generateSubScribe } from "../hooks/useSubScribe";
export type GraphSelect = NodeSelect | LinkSelect;
type NodeSelect = {
  type: "node";
  data: any;
};
type LinkSelect = {
  type: "link";
  data: any;
};
export const {
  useSubScribe: useSubScribeGraphSelect,
  dispatch: dispatchGraphSelect,
} = generateSubScribe<GraphSelect | null>(null);
export const {
  useSubScribe: useSubScribeNodeSelect,
  dispatch: dispatchNodeSelect,
} = generateSubScribe<NodeSelect | null>(null);
export const {
  useSubScribe: useSubScribeSelecting,
  dispatch: dispatchSelecting,
  getCurValue: getCurValueSelecting,
} = generateSubScribe<boolean>(false);
export const {
  useSubScribe: useSubScribeDelMode,
  dispatch: dispatchDelMode,
  getCurValue: getDelMode,
} = generateSubScribe(false);
export const {
  useSubScribe: useSubScribeSelectedLink,
  dispatch: dispatchSelectedLink,
} = generateSubScribe<any | null>(null);
