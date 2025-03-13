import { themeHexColors } from "@/theme";
import { GraphCanvasStyle } from "./types";

export const GRAPH_DEFAULT_SETTINGS = {
  nodeColor: themeHexColors.primary,
  steinerNodeColor: themeHexColors.layer2,
  nodeSize: 6,
  labelSize: 14,
  labelFont: "Inter",
  labelWeight: "normal",
  labelColor: themeHexColors.black,
  edgeWidth: 2,
  edgeColor: themeHexColors.black,
  cameraFitDuration: 500,
  cameraFitRatio: 1.5,
};

export const EXPORT_TAB_CANVAS_PREVIEW_STYLE: GraphCanvasStyle = {
  canvasWidth: 1024,
  canvasHeight: 1024,
  nodeSize: 3,
  edgeSize: 1,
  steinerNodeSize: 1,
  nodeColor: themeHexColors.graphBlack,
  edgeColor: themeHexColors.graphBlack,
};
