import { Button } from "@/components/ui/button.tsx";
import PlayIcon from "@/images/icons/play.svg?react";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import { cn } from "@/lib/utils.ts";
import { Zap, Pencil } from "lucide-react";
import { CanvasMode } from "./types.ts";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext.ts";
import { useFormContext } from "react-hook-form";
import { algorithmsFormSchema } from "../sidebar/components/form/schema.ts";
import { isDirty, z } from "zod";
import { SupportedAlgorithms } from "@/types.ts";
import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
import { isSteinerNode } from "@/lib/graph-utils";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { useEffect } from "react";
import { useThrottleFn } from "react-use";

const canvasModeIconStyles =
  "h-8 w-8 rounded-lg flex items-center justify-center text-active transition-colors transition-opacity duration-300";
const canvasModeIconActiveStyles = "bg-white shadow-icon-bg";

const canvasModeIconMap = {
  [CanvasMode.Visualize]: <SteinerIcon className="h-4 w-4" />,
  [CanvasMode.Draw]: <Pencil className="h-4 w-4" />,
  [CanvasMode.Live]: <Zap className="h-4 w-4" />,
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
  const { setActiveAlgorithmCards } = useFormSettings();

  const {
    trigger,
    formState: { errors },
    reset,
    getValues,
    setFocus,
  } = useFormContext<z.infer<typeof algorithmsFormSchema>>();

  const handleFormInvalid = () => {
    const cardId = Object.keys(errors)[0];
    setActiveAlgorithmCards([cardId] as SupportedAlgorithms[]);

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
    // reset form dirty state
    const values = getValues();
    reset(values);

    // Exclude the dynamic Steiner nodes if present
    const filteredGraph = graph.copy();
    filteredGraph.forEachNode((node, attrs) => {
      if (isSteinerNode(attrs)) {
        filteredGraph.dropNode(node);
      }
    });
    // Update the base graph on which the algorithms should run
    updateInitialGraph(filteredGraph);

    // This calls the computeSolutions function in Canvas.tsx which updates the state of the graph
    controlRef.current?.computeSolutions();
    setGraphDirty(false);
  };

  useThrottleFn(
    (graphDirty: boolean, canvasMode: CanvasMode) => {
      if (canvasMode === CanvasMode.Live && graphDirty) {
        handleExecute();
      }
    },
    100,
    [graphDirty, canvasMode]
  );

  useEffect(() => {
    if (canvasMode === CanvasMode.Live && graphDirty) {
      handleExecute();
    }
  }, [graphDirty, canvasMode]);

  return (
    <div className="w-canvas h-[68px] border-b px-5 flex items-center justify-between">
      <div />
      <div className="bg-accent flex rounded-lg gap-x-2 items-center px-1 py-1">
        {Object.values(CanvasMode).map((mode) => (
          <Tooltip key={mode} delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  canvasModeIconStyles,
                  {
                    [canvasModeIconActiveStyles]: canvasMode === mode,
                  },
                  "relative"
                )}
                onClick={() => handleCanvasModeChange(mode)}
                variant={"icon"}
                size={"icon"}
              >
                {canvasModeIconMap[mode]}
                {canvasMode === mode && mode === CanvasMode.Live && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary  animate-pulse" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white shadow-icon-bg text-active">
              <p className="text-sm">{mode}</p>
              {mode === CanvasMode.Live && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Auto-executes algorithms on every edit.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Not</strong> recommended for <strong>large</strong>{" "}
                    graphs.
                  </p>
                </>
              )}
            </TooltipContent>
          </Tooltip>
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
