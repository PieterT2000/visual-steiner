import { SupportedAlgorithms } from "@/types";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import RectangleIcon from "@/images/icons/rectangle.svg?react";

export const algorithmDisplayProps: Record<
  SupportedAlgorithms,
  { icon: React.ReactNode; bg: string; title: string; shortTitle: string }
> = {
  [SupportedAlgorithms.ESMT]: {
    icon: <SteinerIcon />,
    bg: "bg-layer1",
    title: "Euclidian Steiner minimal tree (ESMT)",
    shortTitle: "ESMT",
  },
  [SupportedAlgorithms.RSMT]: {
    icon: <RectangleIcon />,
    bg: "bg-primary",
    title: "Rectilinear Steiner minimal tree (RSMT)",
    shortTitle: "RSMT",
  },
  [SupportedAlgorithms.PRIMS_MST]: {
    icon: <SteinerIcon />,
    bg: "bg-layer2",
    title: "Minimum spanning tree (Prim's MST)",
    shortTitle: "MST",
  },
  [SupportedAlgorithms.UOSMT]: {
    icon: <SteinerIcon />,
    bg: "bg-layer1",
    title: "Uniformly oriented Steiner minimal tree",
    shortTitle: "UOSMT",
  },
};
