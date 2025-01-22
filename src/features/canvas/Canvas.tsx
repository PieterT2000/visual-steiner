import { Attributes, useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import toast from "react-hot-toast";
import { SupportedAlgorithms, GraphMutationItem } from "@/types.ts";
import { SMTType } from "@/lib/steiner-utils.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
import { calculatePrimsMST, calculateSMT } from "@/lib/algorithm-helpers.ts";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { sigma, setSigma, graph, activeAlgorithm } = useCanvas();
  const highlightedEdgesRef = useRef(new Set<string>());
  const highlightedNodesRef = useRef(new Set<string>());
  const [mutationHistory, setMutationHistory] = useState<GraphMutationItem[]>(
    []
  );
  const nodeCount = useRef(graph.order + 1);

  function registerEventHandlers<
    N extends A,
    E extends A,
    G extends A,
    A extends Attributes
  >(sigma: Sigma<N, E, G>) {
    let isDragging = false;
    let draggingNode: {
      id: string;
      x: number;
      y: number;
      hidden?: boolean;
      zIndex?: number;
    } | null = null;

    let isAddingEdge = false;
    let edgeStartNode: string | null = null;
    let edgeEndNode: string | null = null;

    const dragThreshold = 5;
    let clickTimer: NodeJS.Timeout | null = null;

    let isHoveringNode = false;

    sigma.on("clickStage", (evt) => {
      // console.log("clickStage");
      if (isDragging) return;

      const graphCoord = sigma.viewportToGraph({
        x: evt.event.x,
        y: evt.event.y,
      });
      if (isAddingEdge) {
        graph.dropNode(edgeEndNode);
        const id = nodeCount.current++;
        const newEndNode = graph.addNode(id, {
          ...graphCoord,
          size: 10,
          label: `Node ${id}`,
        });
        graph.addEdge(edgeStartNode, newEndNode);
        edgeStartNode = null;
        edgeEndNode = null;
        isAddingEdge = false;
        // console.log("clickStage - add edge");
        return;
      }

      // check if there are any existing
      let minDist = 10 / sigma.getGraphToViewportRatio(); // 10px scaled to graph
      let existingNode: string | null = null;
      graph.forEachNode((node, attr) => {
        const dist = Math.hypot(graphCoord.x - attr.x, graphCoord.y - attr.y);
        if (dist < minDist) {
          minDist = dist;
          existingNode = node;
        }
      });
      if (existingNode) return;

      const id = nodeCount.current++;
      const node = {
        ...graphCoord,
        size: 10,
        label: `Node ${id}`,
        hidden: false,
      };
      // console.log("clickStage - add node");
      graph.addNode(id, node);
    });

    sigma.on("downNode", (evt) => {
      const graphCoord = sigma.viewportToGraph(evt.event);
      if (isAddingEdge) {
        // find the closest node to the cursor that is not the edgeEndNode
        let minDist = 10 / sigma.getGraphToViewportRatio(); // 10px scaled to graph
        let closest: string | null = null;
        graph.forEachNode((node, attr) => {
          if (node === edgeEndNode) return;
          const dist = Math.hypot(graphCoord.x - attr.x, graphCoord.y - attr.y);
          if (dist < minDist) {
            minDist = dist;
            closest = node;
          }
        });

        if (!closest) return;

        if (closest === edgeStartNode) {
          toast.error("Cannot add edge to itself");
          return;
        }

        // check if the closest node already has an edge to the edgeStartNode
        if (graph.hasEdge(edgeStartNode, closest)) {
          toast.error("Edge already exists");
          return;
        }

        if (graph.hasNode(edgeEndNode)) {
          graph.dropNode(edgeEndNode);
        }

        graph.addEdge(edgeStartNode, closest);
        edgeStartNode = null;
        edgeEndNode = null;
        isAddingEdge = false;
        draggingNode = null;
      } else {
        draggingNode = {
          id: evt.node,
          x: evt.event.x,
          y: evt.event.y,
          hidden: false,
        };
        isDragging = false;
        clickTimer = setTimeout(() => {
          isDragging = true;
          if (clickTimer) clearTimeout(clickTimer);
          clickTimer = null;
        }, 200);
        // console.log("downnode - start dragging");
      }

      // Prevent sigma to move camera
      evt.preventSigmaDefault();
      evt.event.original.preventDefault();
      evt.event.original.stopPropagation();
    });

    sigma.on("doubleClickNode", (evt) => {
      evt.preventSigmaDefault();
    });

    sigma.getMouseCaptor().on("mousemovebody", (evt) => {
      // dist in pixel values

      if (draggingNode) {
        const pos = sigma.viewportToGraph({
          x: evt.x,
          y: evt.y,
        });
        const dist = Math.hypot(evt.x - draggingNode.x, evt.y - draggingNode.y);
        if (dist > dragThreshold) {
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
          }
          isDragging = true;
          graph.setNodeAttribute(draggingNode.id, "x", pos.x);
          graph.setNodeAttribute(draggingNode.id, "y", pos.y);
          // console.log("mouse move - update moving node");
        }
      } else if (isAddingEdge) {
        // console.log("mouse move - update moving edge");
        const pos = sigma.viewportToGraph({
          x: evt.x,
          y: evt.y,
        });
        graph.setNodeAttribute(edgeEndNode, "x", pos.x);
        graph.setNodeAttribute(edgeEndNode, "y", pos.y);
      }

      if (draggingNode || isAddingEdge) {
        // change cursor to move

        // containerRef.current!.style.cursor = "default";
        // Prevent sigma to move camera
        evt.preventSigmaDefault();
        evt.original.preventDefault();
        evt.original.stopPropagation();
      } else if (!isHoveringNode) {
        containerRef.current!.style.cursor = "pointer";
      }
    });

    sigma.on("enterNode", () => {
      if (isHoveringNode || isAddingEdge) return;
      isHoveringNode = true;
      containerRef.current!.style.cursor = "default";
    });

    sigma.on("leaveNode", () => {
      if (!isHoveringNode || isAddingEdge) return;
      isHoveringNode = false;
      containerRef.current!.style.cursor = "pointer";
    });

    // On mouse up, we reset the dragging mode
    sigma.getMouseCaptor().on("mouseup", (evt) => {
      if (clickTimer && draggingNode) {
        // console.log("mouse up add edge");
        clearTimeout(clickTimer);
        clickTimer = null;

        isAddingEdge = true;
        edgeStartNode = draggingNode.id;
        edgeEndNode = "dragging";
        graph.addNode(edgeEndNode, {
          ...sigma.viewportToGraph(evt),
          // small temp node
          size: 1,
        });
        graph.addEdge(edgeStartNode, edgeEndNode);
      }

      isDragging = false;
      draggingNode = null;

      evt.preventSigmaDefault();
      evt.original.preventDefault();
      evt.original.stopPropagation();
    });

    // Disable the autoscale at the first down interaction
    sigma.getMouseCaptor().on("mousedown", () => {
      if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
    });
  }

  /**
   * When graph changed
   * => create sigma
   */
  useEffect(() => {
    let instance: Sigma | null = null;

    if (containerRef.current !== null) {
      instance = new Sigma(graph, containerRef.current, {
        allowInvalidContainer: true,
        // defaultEdgeType: "straight",
        // defaultNodeType: "circle",
        defaultNodeColor: "black",
        defaultEdgeColor: "#d7d7d7",
        zIndex: true,
        edgeReducer(edge, data) {
          if (highlightedEdgesRef.current.has(edge)) {
            return {
              ...data,
              visible: true,
              size: 2,
              color: "red",
            };
          }
          // console.log("edge not found", edge);
          return data;
        },
        nodeReducer(node, data) {
          if (highlightedNodesRef.current.has(node)) {
            return {
              ...data,
              size: 6,
              color: "red",
            };
          }
          return data;
        },
      });
      if (sigma) instance.getCamera().setState(sigma.getCamera().getState());
      registerEventHandlers(instance);
    }
    if (instance) setSigma(instance);

    return () => {
      if (instance) {
        instance.kill();
      }
      setSigma(undefined);
    };
  }, [containerRef, graph]);

  useEffect(() => {
    // trigger replay of edge highlighting
    if (mutationHistory.length > 0) {
      animateEdges();
    }
  }, [mutationHistory]);

  const animateEdges = () => {
    let currentIndex = 0;
    // clear previous highlights
    highlightedEdgesRef.current.clear();
    highlightedNodesRef.current.clear();

    const highlightNextEdge = () => {
      if (currentIndex < mutationHistory.length) {
        const { edge } = mutationHistory[currentIndex];
        highlightedEdgesRef.current.add(edge.id);
        highlightedNodesRef.current.add(edge.source).add(edge.target);
        currentIndex++;
        sigma?.refresh();
        setTimeout(highlightNextEdge, 1000);
      }
    };

    highlightNextEdge();
  };

  const computePrimsMST = () => {
    // clear previous highlights
    highlightedEdgesRef.current.clear();
    highlightedNodesRef.current.clear();
    sigma?.refresh();
    const { treeMutationHistory } = calculatePrimsMST({ graph });
    sigma?.refresh();
    setMutationHistory(treeMutationHistory);
    // setGraph(mst);
  };

  const computeSMT = (type: SMTType) => {
    // clear previous highlights
    highlightedEdgesRef.current.clear();
    highlightedNodesRef.current.clear();
    sigma?.refresh();
    const { edgeMutations } = calculateSMT({ graph }, type);
    edgeMutations.forEach((mutation) => {
      highlightedEdgesRef.current.add(mutation.id);
      highlightedNodesRef.current.add(mutation.source).add(mutation.target);
    });
    sigma?.refresh();
  };

  useEffect(() => {
    if (!activeAlgorithm) return;
    const algorithmFnMap = {
      [SupportedAlgorithms.PRIMS_MST]: computePrimsMST,
      [SupportedAlgorithms.RSMT]: () => computeSMT("rectilinear"),
      [SupportedAlgorithms.SMT]: () => computeSMT("euclidean"),
    } as const;
    algorithmFnMap[activeAlgorithm]();
  }, [activeAlgorithm]);

  return (
    <div
      className="w-canvas h-screen bg-dotted"
      id="container"
      ref={containerRef}
    />
  );
}
