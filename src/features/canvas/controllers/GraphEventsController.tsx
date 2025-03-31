import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";
import { nanoid as generateId } from "nanoid";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import { useValueRef } from "@/hooks/useValueRef";
import { useGraphContext } from "@/providers/graph/GraphContext";
import { CanvasMode } from "../types";
import toast from "react-hot-toast";
import { isSteinerNode } from "@/lib/graph-utils";

const noop = () => {};

const resetEventHandlers = (
  registerEvents: ReturnType<typeof useRegisterEvents>
) => {
  registerEvents({
    clickStage: noop,
    downNode: noop,
    doubleClickNode: noop,
    mousemovebody: noop,
  });
};

const GraphEventsController = ({
  children,
  isDrawMode,
}: {
  children?: React.ReactNode;
  isDrawMode: boolean;
}) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const containerRef = sigma.getContainer();
  const registerEvents = useRegisterEvents();
  const { setGraphDirty, graphDirty, canvasMode } = useCanvas();
  const { graphPubSub } = useGraphContext();
  const isGraphDirtyRef = useValueRef(graphDirty);
  const isLiveMode = useValueRef(canvasMode === CanvasMode.Live);

  useEffect(() => {
    if (!isDrawMode) {
      resetEventHandlers(registerEvents);
      return;
    }

    let isDragging = false;
    let draggingNode: {
      id: string;
      x: number;
      y: number;
      hidden?: boolean;
      zIndex?: number;
      isTemp?: boolean;
    } | null = null;

    const dragThreshold = 5;
    let clickTimer: NodeJS.Timeout | null = null;

    let isHoveringNode = false;

    // Original node that is being dragged/edited

    registerEvents({
      rightClickNode: (evt) => {
        evt.preventSigmaDefault();
        evt.event.original.preventDefault();
        evt.event.original.stopPropagation();
        const nodeId = evt.node;
        if (!nodeId) return;
        const isSteiner = isSteinerNode(graph.getNodeAttributes(nodeId));
        if (isSteiner && isLiveMode.current) {
          toast.error("Steiner nodes can't be deleted in live mode");
          return;
        }
        graph.dropNode(nodeId);
        isHoveringNode = false;
        if (!isGraphDirtyRef.current) {
          setGraphDirty(true);
        }
        graphPubSub.publishGraphUpdated();
      },
      clickStage: (evt) => {
        if (isDragging) return;

        const graphCoord = sigma.viewportToGraph({
          x: evt.event.x,
          y: evt.event.y,
        });

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

        const id = generateId();
        const node = {
          ...graphCoord,
          isTemp: true,
        };
        graph.addNode(id, node);
        if (!isGraphDirtyRef.current) {
          setGraphDirty(true);
        }
        graphPubSub.publishGraphUpdated();
      },
      downNode: (evt) => {
        // check if mouse right button is pressed
        const event = evt.event.original as MouseEvent;
        const isRightButton = event.button === 2;
        if (isRightButton) {
          // should be handled by rightClickNode event
          return;
        }
        draggingNode = {
          id: evt.node,
          x: evt.event.x,
          y: evt.event.y,
        };

        isDragging = false;

        clickTimer = setTimeout(() => {
          // If mouse does not move within 200ms, event is drag/edit event
          isDragging = true;
          if (clickTimer) clearTimeout(clickTimer);
          clickTimer = null;
        }, 200);

        // Prevent sigma to move camera
        evt.preventSigmaDefault();
        evt.event.original.preventDefault();
        evt.event.original.stopPropagation();
      },
      doubleClickNode: (evt) => {
        evt.preventSigmaDefault();
      },
      mousemovebody: (evt) => {
        if (!draggingNode) return;
        const isSteiner = isSteinerNode(
          graph.getNodeAttributes(draggingNode.id)
        );
        if (isSteiner && isLiveMode.current) {
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
          }
          draggingNode = null;
          isDragging = false;
          toast.error("Steiner nodes can't be moved in live mode");
          return;
        }
        // dist in pixel values
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

          // if (!isGraphDirtyRef.current && !isSteiner) {
          //   setGraphDirty(true);
          // }
        }

        // change cursor to move

        // containerRef.style.cursor = "default";
        // Prevent sigma to move camera
        evt.preventSigmaDefault();
        evt.original.preventDefault();
        evt.original.stopPropagation();
      },
      enterNode: () => {
        if (isHoveringNode) return;
        isHoveringNode = true;
        containerRef.style.cursor = "default";
      },
      leaveNode: () => {
        if (!isHoveringNode) return;
        isHoveringNode = false;
        containerRef.style.cursor = "pointer";
      },
      mouseup: (evt) => {
        const event = evt.original as MouseEvent;
        const isRightButton = event.button === 2;
        if (isRightButton) {
          // should be handled by rightClickNode event
          return;
        }
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }

        if (draggingNode) {
          const pos = sigma.viewportToGraph({
            x: evt.x,
            y: evt.y,
          });
          // move existing node
          graph.setNodeAttribute(draggingNode.id, "x", pos.x);
          graph.setNodeAttribute(draggingNode.id, "y", pos.y);
          isDragging = false;
          draggingNode = null;
          if (!isGraphDirtyRef.current) {
            setGraphDirty(true);
          }
          graphPubSub.publishGraphUpdated();
        }

        evt.preventSigmaDefault();
        evt.original.preventDefault();
        evt.original.stopPropagation();
      },
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [isDrawMode]);

  return <>{children}</>;
};

export default GraphEventsController;
