import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { SupportedAlgorithms } from "@/types.ts";
import { SMTType } from "@/lib/steiner-utils.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
import { calculatePrimsMST, calculateSMT } from "@/lib/algorithm-helpers.ts";
import { NodePointProgram } from "sigma/rendering";
import { SigmaContainer } from "@react-sigma/core";
import { AlgorithmSolution, CanvasMode } from "./types.ts";
import { useImmer } from "use-immer";
import GraphSettingsController from "./controllers/GraphSettingsController.tsx";
import GraphEventsController from "./controllers/GraphEventsController.tsx";
import { default as Sigma } from "sigma";
import Graph from "graphology";
import { mergeGraphs, replaceGraph } from "@/lib/graph-utils.ts";
import ZoomControls from "./components/ZoomControls";
import "@react-sigma/core/lib/style.css";
import "./styles/overrides.css";
import LengthRatioBox from "./components/LengthRatioBox";
import { graphCanvasToImageUrl } from "./utils/dom-utils.ts";
import { GRAPH_DEFAULT_SETTINGS } from "./consts";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext";
import { useValueRef } from "@/hooks/useValueRef";

const createSolutionInitState = (
  algorithm: SupportedAlgorithms
): AlgorithmSolution => ({
  algorithm,
  highlightedNodes: new Set(),
  highlightedEdges: new Set(),
  meta: {
    length: 0,
  },
});

export default function Canvas() {
  const { graph, controlRef, setCanvasImageUrl, initialGraphRef, canvasMode } =
    useCanvas();
  const { algorithmVisibility, graphPubSub } = useFormSettings();

  const visibleAlgorithmsRef = useValueRef(
    algorithmVisibility
      .filter((item) => item.visible)
      .map((item) => item.algorithm)
  );

  const [solutions, setSolutions] = useImmer<AlgorithmSolution[]>([]);

  const sigmaSettings = useMemo(
    () => ({
      allowInvalidContainer: true,
      nodeProgramClasses: {
        ["circle"]: NodePointProgram,
      },
      zIndex: true,
      labelColor: {
        color: GRAPH_DEFAULT_SETTINGS.labelColor,
      },
      labelSize: GRAPH_DEFAULT_SETTINGS.labelSize,
      labelFont: GRAPH_DEFAULT_SETTINGS.labelFont,
      labelWeight: GRAPH_DEFAULT_SETTINGS.labelWeight,
      defaultNodeColor: GRAPH_DEFAULT_SETTINGS.nodeColor,
      defaultEdgeColor: GRAPH_DEFAULT_SETTINGS.edgeColor,
    }),
    []
  );

  const steinerNodeIdsRef = useRef<string[]>([]);

  useImperativeHandle(
    controlRef,
    () => {
      return {
        computeSolutions,
        setSigmaSettings: (
          settings: Parameters<Sigma["setSettings"]>[number]
        ) => {
          return sigmaRef.current?.setSettings(settings);
        },
      };
    },
    []
  );

  const computePrimsMST = (problemInstance: Graph) => {
    const {
      edgeMutations,
      graph: updatedGraph,
      length,
    } = calculatePrimsMST({
      graph: problemInstance,
    });
    const algo = SupportedAlgorithms.PRIMS_MST;

    mergeGraphs(graph, updatedGraph);
    setSolutions((draft) => {
      let solution = draft.find((solution) => solution.algorithm === algo);
      if (!solution) {
        solution = createSolutionInitState(algo);
        draft.push(solution);
      }
      edgeMutations.forEach((edge) => {
        solution.highlightedEdges.add(edge.id);
        solution.highlightedNodes.add(edge.source).add(edge.target);
      });
      solution.meta.length = length;
    });
  };

  const computeSMT = (type: SMTType, problemInstance: Graph) => {
    const {
      edgeMutations,
      meta: { steinerNodeIds },
      graph: updatedGraph,
      length,
    } = calculateSMT(type, { graph: problemInstance });
    steinerNodeIdsRef.current = steinerNodeIds;
    const algorithm =
      type === "euclidean"
        ? SupportedAlgorithms.ESMT
        : SupportedAlgorithms.RSMT;

    mergeGraphs(graph, updatedGraph);
    setSolutions((draft) => {
      let solution = draft.find((solution) => solution.algorithm === algorithm);
      if (!solution) {
        solution = createSolutionInitState(algorithm);
        draft.push(solution);
      }
      edgeMutations.forEach((mutation) => {
        solution.highlightedEdges.add(mutation.id);
        solution.highlightedNodes.add(mutation.source).add(mutation.target);
      });
      solution.meta.length = length;
    });
  };

  const computeSolutions = () => {
    // reset to initial graph
    replaceGraph(graph, initialGraphRef.current);

    const problemGraph = graph.copy();
    // clear previous solutions
    setSolutions([]);
    [
      SupportedAlgorithms.ESMT,
      SupportedAlgorithms.PRIMS_MST,
      SupportedAlgorithms.RSMT,
    ].forEach((algorithm) => {
      if (algorithm === SupportedAlgorithms.PRIMS_MST) {
        computePrimsMST(problemGraph);
      } else if (algorithm === SupportedAlgorithms.ESMT) {
        computeSMT("euclidean", problemGraph);
      } else if (algorithm === SupportedAlgorithms.RSMT) {
        computeSMT("rectilinear", problemGraph);
      }
    });

    // update image url
    handleGraphUpdated();
  };

  const sigmaRef = useRef<Sigma>(null);

  const generateCanvasImageUrl = useCallback(async () => {
    const sigma = sigmaRef.current;
    try {
      if (sigma) {
        return await graphCanvasToImageUrl(sigma, visibleAlgorithmsRef.current);
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const handleGraphUpdated = useCallback(() => {
    requestIdleCallback(() => {
      generateCanvasImageUrl()
        .then((imageUrl) => {
          console.log("imageUrl", imageUrl);
          setCanvasImageUrl((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev);
            }
            return imageUrl;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, []);

  // useEffect(() => {
  //   const unsubscribe = graphPubSub.subscribeGraphUpdated(handleGraphUpdated);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <SigmaContainer
      className="w-canvas h-screen relative"
      id="container"
      graph={graph}
      settings={sigmaSettings}
      ref={sigmaRef}
    >
      <ZoomControls />
      <LengthRatioBox solutions={solutions} />
      <GraphSettingsController
        solutions={solutions}
        isDrawMode={canvasMode === CanvasMode.Draw}
      />
      <GraphEventsController isDrawMode={canvasMode === CanvasMode.Draw} />
    </SigmaContainer>
  );
}
