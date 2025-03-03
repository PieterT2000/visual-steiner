import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { useEffect } from "react";
import { nanoid as generateId } from "nanoid";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import { useValueRef } from "@/hooks/useValueRef";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext";

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
  const { setGraphDirty, graphDirty } = useCanvas();
  const { graphPubSub } = useFormSettings();
  const isGraphDirtyRef = useValueRef(graphDirty);

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
          size: 10,
          hidden: false,
          isTemp: true,
        };
        graph.addNode(id, node);
        if (!isGraphDirtyRef.current) {
          setGraphDirty(true);
        }
        graphPubSub.publishGraphUpdated();
      },
      downNode: (evt) => {
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
        }

        // change cursor to move

        // containerRef.style.cursor = "default";
        // Prevent sigma to move camera
        evt.preventSigmaDefault();
        evt.original.preventDefault();
        evt.original.stopPropagation();

        if (!isGraphDirtyRef.current) {
          setGraphDirty(true);
        }
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
