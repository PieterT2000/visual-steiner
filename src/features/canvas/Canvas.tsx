import { useImperativeHandle, useMemo, useRef } from "react";
import { Metric, SupportedAlgorithms } from "@/types.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
import { calculatePrimsMST, calculateSMT } from "@/lib/algorithm-helpers.ts";
import { NodePointProgram } from "sigma/rendering";
import { SigmaContainer } from "@react-sigma/core";
import { AlgorithmSolution, CanvasMode } from "./types.ts";
import GraphSettingsController from "./controllers/GraphSettingsController.tsx";
import GraphEventsController from "./controllers/GraphEventsController.tsx";
import Sigma from "sigma";
import Graph from "graphology";
import { mergeGraphs, replaceGraph } from "@/lib/graph-utils.ts";
import ZoomControls from "./components/ZoomControls";
import "@react-sigma/core/lib/style.css";
import "./styles/overrides.css";
import SteinerRatioBox from "./components/SteinerRatioBox.tsx";
import { GRAPH_DEFAULT_SETTINGS } from "./consts";
import { useGraphPubSub } from "./hooks/useGraphPubSub";
import { Settings } from "sigma/settings";

const createSolutionInitState = (
  algorithm: SupportedAlgorithms,
  metric: Metric
): AlgorithmSolution => ({
  algorithm,
  metric,
  highlightedNodes: new Set(),
  highlightedEdges: new Set(),
  meta: {
    length: 0,
  },
});

export default function Canvas() {
  const {
    graph,
    controlRef,
    initialGraphRef,
    canvasMode,
    setSolutions,
    solutions,
  } = useCanvas();
  const { publishGraphUpdated } = useGraphPubSub();
  const sigmaSettings: Partial<Settings> = useMemo(
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
      minEdgeThickness: GRAPH_DEFAULT_SETTINGS.edgeWidth,
    }),
    []
  );

  const steinerNodeIdsRef = useRef<string[]>([]);

  useImperativeHandle(
    controlRef,
    () => {
      return {
        computeSolutions,
        animatedCameraFit: (
          duration = GRAPH_DEFAULT_SETTINGS.cameraFitDuration
        ) => {
          // Set initial position for fade-in effect
          sigmaRef.current?.getCamera().setState({
            x: 0.5,
            y: 0.5,
            ratio: 10,
          });
          // Animate to final position
          sigmaRef.current?.getCamera().animate(
            {
              x: 0.5,
              y: 0.5,
              ratio: GRAPH_DEFAULT_SETTINGS.cameraFitRatio,
            },
            { duration }
          );
        },
        getSigma: () => sigmaRef.current,
      };
    },
    []
  );

  const computePrimsMST = (problemInstance: Graph, metric: Metric) => {
    const {
      edgeMutations,
      graph: updatedGraph,
      length,
    } = calculatePrimsMST({
      graph: problemInstance,
      metric,
    });
    const algo =
      metric === Metric.EUCLIDEAN
        ? SupportedAlgorithms.PRIMS_EMST
        : SupportedAlgorithms.PRIMS_RSMT;

    const mergedEdgesMap = mergeGraphs(graph, updatedGraph);
    // replace edgeIds with the correct edgeIds
    edgeMutations.forEach((mutation) => {
      if (mergedEdgesMap.has(mutation.key)) {
        mutation.key = mergedEdgesMap.get(mutation.key)!;
      }
    });

    setSolutions((draft) => {
      let solution = draft.find((solution) => solution.algorithm === algo);
      if (!solution) {
        solution = createSolutionInitState(algo, metric);
        draft.push(solution);
      }
      edgeMutations.forEach((edge) => {
        solution.highlightedEdges.add(edge.key);
        solution.highlightedNodes.add(edge.source).add(edge.target);
      });
      solution.meta.length = length;
    });
  };

  const computeSMT = (problemInstance: Graph, metric: Metric) => {
    const {
      edgeMutations,
      meta: { steinerNodeIds },
      graph: updatedGraph,
      length,
    } = calculateSMT({ graph: problemInstance, metric });
    steinerNodeIdsRef.current = steinerNodeIds;
    const algorithm =
      metric === Metric.EUCLIDEAN
        ? SupportedAlgorithms.ESMT
        : SupportedAlgorithms.RSMT;

    const mergedEdgesMap = mergeGraphs(graph, updatedGraph);
    // replace edgeIds with the correct edgeIds
    edgeMutations.forEach((mutation) => {
      if (mergedEdgesMap.has(mutation.key)) {
        mutation.key = mergedEdgesMap.get(mutation.key)!;
      }
    });

    setSolutions((draft) => {
      let solution = draft.find((solution) => solution.algorithm === algorithm);
      if (!solution) {
        solution = createSolutionInitState(algorithm, metric);
        draft.push(solution);
      }
      edgeMutations.forEach((mutation) => {
        solution.highlightedEdges.add(mutation.key);
        solution.highlightedNodes.add(mutation.source).add(mutation.target);
      });
      solution.meta.length = length;
    });
  };

  const computeSolutions = () => {
    // reset to initial graph
    const initialGraph = initialGraphRef.current;
    // reset edge.algorithm to empty array
    initialGraph.forEachEdge((_, attributes) => {
      Object.assign(attributes, {
        algorithm: [],
      });
    });
    replaceGraph(graph, initialGraphRef.current);

    const problemGraph = graph.copy();

    setSolutions([]);

    const computationMap: Record<SupportedAlgorithms, () => void> = {
      [SupportedAlgorithms.PRIMS_EMST]: () =>
        computePrimsMST(problemGraph, Metric.EUCLIDEAN),
      [SupportedAlgorithms.PRIMS_RSMT]: () =>
        computePrimsMST(problemGraph, Metric.RECTILINEAR),
      [SupportedAlgorithms.ESMT]: () =>
        computeSMT(problemGraph, Metric.EUCLIDEAN),
      [SupportedAlgorithms.RSMT]: () =>
        computeSMT(problemGraph, Metric.RECTILINEAR),
    };
    Object.values(SupportedAlgorithms).forEach((algorithm) => {
      computationMap[algorithm]();
    });
    publishGraphUpdated();
  };

  const sigmaRef = useRef<Sigma>(null);

  return (
    <SigmaContainer
      className="w-canvas h-screen relative"
      id="container"
      graph={graph}
      settings={sigmaSettings}
      ref={sigmaRef}
    >
      <ZoomControls
        animationDuration={GRAPH_DEFAULT_SETTINGS.cameraFitDuration}
        sigmaRef={sigmaRef}
      />
      <SteinerRatioBox solutions={solutions} />
      <GraphSettingsController
        solutions={solutions}
        isDrawMode={
          canvasMode === CanvasMode.Draw || canvasMode === CanvasMode.Live
        }
      />
      <GraphEventsController
        isDrawMode={
          canvasMode === CanvasMode.Draw || canvasMode === CanvasMode.Live
        }
      />
    </SigmaContainer>
  );
}
