import { Button, TooltipButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createDefaultGraph,
  isEuclidSteinerNode,
  isRectSteinerNode,
  isSteinerNode,
} from "@/lib/graph-utils";
import { generateRandomGraph } from "@/lib/graph-utils";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import { Fragment, useMemo, useState } from "react";
import FileUpload from "./FileUpload";
import { useGraphContext } from "@/providers/graph/GraphContext";
import { RotateCcw } from "lucide-react";
import { GraphSource } from "@/types";

const ImportTab = () => {
  const { graph, replaceGraphInContext } = useCanvas();
  const [randomGraphSize, setRandomGraphSize] = useState<number | null>(null);
  const { graphSource, setGraphSource } = useGraphContext();

  const activeGraphMetadata = useMemo(() => {
    return {
      source: {
        label: "Source",
        value: graphSource,
      },
      nodes: {
        label: "# Vertices",
        value: graph.filterNodes((_, attr) => !isSteinerNode(attr)).length,
      },
      edges: {
        label: "# Euclidean S-points",
        value: graph.filterNodes((_, attr) => isEuclidSteinerNode(attr)).length,
      },
      rectSteinerPoints: {
        label: "# Rectilinear S-points",
        value: graph.filterNodes((_, attr) => isRectSteinerNode(attr)).length,
      },
    };
  }, [graph.order, graph.size, graphSource]);

  const handleGenerateRandomGraph = () => {
    if (randomGraphSize === null || randomGraphSize <= 0) {
      return;
    }
    setGraphSource(GraphSource.RANDOM_GRAPH);
    replaceGraphInContext(generateRandomGraph(randomGraphSize));
  };

  const handleResetGraph = () => {
    setGraphSource(GraphSource.DEFAULT_GRAPH);
    replaceGraphInContext(createDefaultGraph());
  };

  return (
    <div className="flex flex-col gap-y-6 h-[inherit]">
      <div className="rounded-lg bg-accent p-3 flex flex-col gap-y-3">
        <div className="flex items-center gap-x-2 justify-between">
          <p className="font-medium text-base text-black">Active graph</p>
          <TooltipButton
            variant="ghost"
            size="icon"
            tooltip="Reset graph"
            onClick={handleResetGraph}
          >
            <RotateCcw className="w-4 h-4" />
          </TooltipButton>
        </div>
        <div className="flex w-full gap-x-6">
          <div
            className="grid gap-y-2 gap-x-3 h-min"
            style={{
              gridTemplateColumns: "max-content 1fr",
            }}
          >
            {Object.entries(activeGraphMetadata).map(([key, value]) => (
              <Fragment key={key}>
                <p className="text-sm text-text font-medium">{value.label}:</p>
                <p className="text-sm text-black font-medium break-all">
                  {value.value}
                </p>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <p className="font-semibold text-base text-black">Generate graph</p>
        <div className="flex gap-x-3">
          <Input
            className="h-9"
            placeholder="# nodes"
            value={randomGraphSize ?? ""}
            type="number"
            onChange={(e) =>
              setRandomGraphSize(
                Number.isNaN(e.target.valueAsNumber)
                  ? null
                  : e.target.valueAsNumber
              )
            }
          />
          <Button
            disabled={randomGraphSize === null || randomGraphSize <= 0}
            onClick={handleGenerateRandomGraph}
          >
            Generate
          </Button>
        </div>
      </div>
      <FileUpload />
    </div>
  );
};

export default ImportTab;
