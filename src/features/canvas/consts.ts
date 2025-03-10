import { themeHexColors } from "@/theme";
import { GraphCanvasStyle } from "./types";

export const GRAPH_DEFAULT_SETTINGS = {
  nodeSize: 8,
  nodeColor: themeHexColors.black,
  steinerNodeColor: themeHexColors.primary,
  labelSize: 14,
  labelFont: "Inter",
  labelWeight: "normal",
  labelColor: themeHexColors.black,
  edgeWidth: 1,
  edgeColor: themeHexColors.black,
  cameraFitDuration: 500,
  cameraFitRatio: 1.5,
};

export const IMPORT_TAB_CANVAS_PREVIEW_STYLE: GraphCanvasStyle = {
  canvasWidth: 256,
  canvasHeight: 256,
  nodeSize: 6,
  edgeSize: 4,
  nodeColor: themeHexColors.primary,
  edgeColor: themeHexColors.primary,
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
