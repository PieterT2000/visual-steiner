import { useEffect, useMemo } from "react";
import { useSigma } from "@react-sigma/core";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext.ts";
import { AlgorithmSolution } from "../types.ts";
import { useFormContext } from "react-hook-form";
import { AlgorithmsFormSchema } from "@/features/sidebar/components/form/schema.ts";
import { getNodeColor, isDrawNode } from "../utils/graph-utils.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import { GRAPH_DEFAULT_SETTINGS } from "../consts";

type AlgorithmRenderItem = AlgorithmSolution & {
  displaySettings: AlgorithmsFormSchema[keyof AlgorithmsFormSchema];
};

const GraphSettingsController = ({
  children,
  solutions,
  isDrawMode,
}: {
  children?: React.ReactNode;
  solutions: AlgorithmSolution[];
  isDrawMode: boolean;
}) => {
  const {
    getValues,
    formState: { defaultValues },
  } = useFormContext<AlgorithmsFormSchema>();
  const sigma = useSigma();
  const { algorithmVisibility } = useFormSettings();
  const { initialGraphRef } = useCanvas();
  const renderItems = useMemo(() => {
    // algorithm visibility contains order or display and visibility
    // since the first algorithm should be rendered last for z-index purposes, the order is reversed
    const reversedVisibleAlgorithms = [...algorithmVisibility]
      .reverse()
      .filter((item) => item.visible);
    return reversedVisibleAlgorithms
      .map((item) => {
        const solution = solutions.find(
          (solution) => solution.algorithm === item.algorithm
        );
        if (!solution) {
          return null;
        }
        const algorithmSettings =
          getValues(item.algorithm) ?? defaultValues![item.algorithm];
        return {
          ...solution,
          displaySettings: algorithmSettings,
        };
      })
      .filter(Boolean) as AlgorithmRenderItem[];
  }, [algorithmVisibility, solutions]);

  useEffect(() => {
    sigma.setSetting("nodeReducer", (node, data) => {
      let finalData = { ...data };
      let isDanglingNode = true;

      // Only apply custom node styles when not in draw (editing) mode
      renderItems.forEach((algorithm, idx) => {
        if (algorithm.highlightedNodes.has(node)) {
          isDanglingNode = false;
          finalData = {
            ...finalData,
            size: isDrawMode
              ? GRAPH_DEFAULT_SETTINGS.nodeSize
              : algorithm.displaySettings?.vertexRadius,
            color: getNodeColor(data, algorithm.displaySettings, isDrawMode),
            // 0 zindex does not work in SigmaJS
            zIndex: idx + 1,
            hidden: false,
          };
        }
      });

      if (isDanglingNode) {
        const isInitialNode = initialGraphRef.current.hasNode(node);
        const isNodeHidden = !(isInitialNode || isDrawNode(data));
        finalData = {
          ...finalData,
          hidden: isNodeHidden,
        };
      }
      return finalData;
    });

    sigma.setSetting("edgeReducer", (edge, data) => {
      let finalData = { ...data };
      let isDanglingEdge = true;

      // Only apply custom edge styles when not in draw (editing) mode
      renderItems.forEach((algorithm, idx) => {
        if (algorithm.highlightedEdges.has(edge)) {
          isDanglingEdge = false;
          finalData = {
            ...finalData,
            hidden: false,
            // 0 zindex does not work in SigmaJS
            zIndex: idx + 1,
            color: isDrawMode
              ? GRAPH_DEFAULT_SETTINGS.edgeColor
              : algorithm.displaySettings?.colors.edge,
            size: isDrawMode
              ? GRAPH_DEFAULT_SETTINGS.edgeWidth
              : algorithm.displaySettings?.edgeWidth,
          };
        }
      });

      if (isDanglingEdge) {
        finalData = {
          ...finalData,
          // No matter the canvas mode, hide edges not part of the solution
          hidden: true,
        };
      }
      return finalData;
    });
  }, [renderItems, initialGraphRef.current, isDrawMode]);

  return <>{children}</>;
};

export default GraphSettingsController;
