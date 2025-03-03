import { themeHexColors } from "@/theme";

export const GRAPH_DEFAULT_SETTINGS = {
  nodeSize: 10,
  nodeColor: themeHexColors.black,
  steinerNodeColor: themeHexColors.primary,
  labelSize: 14,
  labelFont: "Inter",
  labelWeight: "normal",
  labelColor: themeHexColors.black,
  edgeWidth: 1,
  edgeColor: themeHexColors.black,
};
// in edit mode:
// when dragging a node (add temp node and hide original node)
// when adding node, just add it
// when deleting a node, don't delete it, just set its hidden attribute to true
// in visualise mode, show both temp node and the original node
// toggle hidden attribute of original nodes
