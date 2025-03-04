import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isEuclidSteinerNode,
  isRectSteinerNode,
  isSteinerNode,
} from "@/lib/graph-utils";
import useOnMountOnce from "@/hooks/useOnMountOnce";
import { generateRandomGraph } from "@/lib/graph-utils";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import { Fragment, useMemo, useState } from "react";

const ImportTab = () => {
  const { canvasImageUrl, graph, replaceGraphInContext, controlRef } =
    useCanvas();
  const [randomGraphSize, setRandomGraphSize] = useState<number | null>(null);
  const [graphSource, setGraphSource] = useState<string | null>(
    "default_graph"
  );

  useOnMountOnce(() => {
    controlRef.current?.triggerUpdateGraphThumbnail();
  });

  const activeGraphMetadata = useMemo(() => {
    return {
      source: {
        label: "Source",
        value: graphSource,
      },
      nodes: {
        label: "#Vertices",
        value: graph.filterNodes((_, attr) => !isSteinerNode(attr)).length,
      },
      edges: {
        label: "#Eucl. Steiner points",
        value: graph.filterNodes((_, attr) => isEuclidSteinerNode(attr)).length,
      },
      rectSteinerPoints: {
        label: "#Rect. Steiner points",
        value: graph.filterNodes((_, attr) => isRectSteinerNode(attr)).length,
      },
    };
  }, [graph.order, graph.size, graphSource]);

  const handleGenerateRandomGraph = () => {
    if (randomGraphSize === null || randomGraphSize <= 0) {
      return;
    }
    setGraphSource("random_graph");
    replaceGraphInContext(generateRandomGraph(randomGraphSize));
  };

  return (
    <div className="flex flex-col gap-y-6 h-[inherit]">
      <div className="rounded-lg bg-accent p-3 flex flex-col gap-y-3">
        <p className="font-medium text-base text-black">Active graph</p>
        <div className="flex w-full gap-x-6">
          {canvasImageUrl ? (
            <img
              src={canvasImageUrl}
              alt="graph"
              className="h-full bg-transparent w-[100px]"
            />
          ) : (
            <div className="h-full bg-transparent flex items-center justify-center text-xs w-[100px]">
              Click on "execute" to generate graph thumbnail
            </div>
          )}
          <div
            className="grid gap-3 h-min"
            style={{
              gridTemplateColumns: "max-content 1fr",
            }}
          >
            {Object.entries(activeGraphMetadata).map(([key, value]) => (
              <Fragment key={key}>
                <p className="text-sm text-text font-medium">{value.label}:</p>
                <p className="text-sm text-black font-medium">{value.value}</p>
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
      <div className="flex flex-col gap-y-4 h-[inherit]">
        <div className="flex flex-col gap-1">
          <p className="text-black font-semibold text-base">Import graph</p>
          <p className="text-text text-sm">
            Upload a compatible graph data file to display
          </p>
        </div>
        <div className="flex flex-col gap-y-1 h-[inherit]">
          <div className="grow w-full  h-[inherit] rounded-lg border-inputBorder border-2 border-dashed [stroke-dasharray:4,2]"></div>
          <p className="text-xs leading-[18px] text-active text-center">
            Supported data formats: .csv, .txt, .json (JSON-graph)
          </p>
        </div>
        <div className="flex justify-end gap-x-2">
          {/* <Button variant="outline" className="h-10">
            Cancel
          </Button> */}
          <Button disabled={true}>Import</Button>
        </div>
      </div>
    </div>
  );
};

export default ImportTab;
