import { Button } from "@/components/ui/button.tsx";
import PlayIcon from "@/images/icons/play.svg?react";
import PencilIcon from "@/images/icons/pencil.svg?react";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import { cn } from "@/lib/utils.ts";
import { CanvasMode } from "./types.ts";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext.ts";
import { useFormContext } from "react-hook-form";
import { algorithmsFormSchema } from "../sidebar/components/form/schema.ts";
import { z } from "zod";
import { SupportedAlgorithms } from "@/types.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
import { isSteinerNode } from "./utils/graph-utils";

const canvasModeIconStyles =
  "h-8 w-8 rounded-full flex items-center justify-center text-active transition-colors transition-opacity duration-300";
const canvasModeIconActiveStyles = "bg-white shadow-icon-bg";

const canvasModeIconMap = {
  [CanvasMode.Visualize]: <SteinerIcon />,
  [CanvasMode.Draw]: <PencilIcon />,
};

const CanvasNavigation = () => {
  const {
    canvasMode,
    setCanvasMode,
    updateInitialGraph,
    graph,
    controlRef,
    graphDirty,
    setGraphDirty,
  } = useCanvas();
  const { setActiveAlgorithmCard } = useFormSettings();

  const {
    trigger,
    formState: { errors },
    setFocus,
  } = useFormContext<z.infer<typeof algorithmsFormSchema>>();

  const handleFormInvalid = () => {
    const cardId = Object.keys(errors)[0];
    setActiveAlgorithmCard(cardId as SupportedAlgorithms);

    const errorCard = errors[cardId as keyof typeof errors];
    // ts guard - this should never happen
    if (!errorCard) {
      return;
    }
    const fieldId = Object.keys(errorCard)[0];
    // In the next render tick, the form will be rendered, and the first error field should be focused
    requestAnimationFrame(() => {
      // @ts-expect-error - we cannot use two broad string types to get back the narrow type (schema key type)
      setFocus(`${cardId}.${fieldId}`);
    });
  };

  const handleCanvasModeChange = (mode: CanvasMode) => {
    setCanvasMode(mode);
  };

  const handleExecute = async () => {
    const isValid = await trigger();
    if (!isValid) {
      handleFormInvalid();
      return;
    }

    // If running the algorithms again, don't include the dynamic Steiner nodes
    if (canvasMode === CanvasMode.Draw) {
      const filteredGraph = graph.copy();
      filteredGraph.forEachNode((node, attrs) => {
        if (isSteinerNode(attrs)) {
          filteredGraph.dropNode(node);
        }
      });
      updateInitialGraph(filteredGraph);
    }

    // This calls the computeSolutions function in Canvas.tsx which updates the state of the graph
    controlRef.current?.computeSolutions();
    setGraphDirty(false);
  };

  return (
    <div className="w-canvas h-[68px] border-b px-5 flex items-center justify-between">
      <div />
      <div className="bg-accent flex rounded-[24px] gap-x-2 items-center px-1 py-1">
        {Object.values(CanvasMode).map((mode) => (
          <Button
            key={mode}
            className={cn(canvasModeIconStyles, {
              [canvasModeIconActiveStyles]: canvasMode === mode,
            })}
            onClick={() => handleCanvasModeChange(mode)}
            variant={"icon"}
            size={"icon"}
          >
            {canvasModeIconMap[mode]}
          </Button>
        ))}
      </div>
      <Button
        disabled={!graphDirty}
        className="px-4 py-2"
        size="lg"
        onClick={handleExecute}
      >
        <PlayIcon />
        <span>Execute</span>
      </Button>
    </div>
  );
};

export default CanvasNavigation;
