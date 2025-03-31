import { SupportedAlgorithms } from "@/types";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import RectangleIcon from "@/images/icons/rectangle.svg?react";

export const algorithmDisplayProps: Record<
  SupportedAlgorithms,
  { icon: React.ReactNode; bg: string; title: string; shortTitle: string }
> = {
  [SupportedAlgorithms.ESMT]: {
    icon: <SteinerIcon />,
    bg: "bg-primary",
    title: "Euclidian Steiner minimal tree (ESMT)",
    shortTitle: "ESMT",
  },
  [SupportedAlgorithms.RSMT]: {
    icon: <RectangleIcon />,
    bg: "bg-primary",
    title: "Rectilinear Steiner minimal tree (RSMT)",
    shortTitle: "RSMT",
  },
  [SupportedAlgorithms.PRIMS_EMST]: {
    icon: <SteinerIcon />,
    bg: "bg-layer2",
    title: "Euclidean minimum spanning tree (EMST)",
    shortTitle: "EMST",
  },
  [SupportedAlgorithms.PRIMS_RSMT]: {
    icon: <RectangleIcon />,
    bg: "bg-layer2",
    title: "Rectilinear minimum spanning tree (RMST)",
    shortTitle: "RMST",
  },
};
