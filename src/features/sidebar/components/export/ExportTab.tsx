import { algorithmDisplayProps } from "@/components/display-props";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ArrowDownFilledIcon from "@/images/icons/arrow_fown_filled.svg?react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalize, cn } from "@/lib/utils";
import { SupportedAlgorithms } from "@/types";
import { useCallback, useState } from "react";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import {
  addWhiteBackground,
  graphCanvasToImageUrl,
} from "@/features/canvas/utils/dom-utils";
import { useAsyncFn } from "react-use";
import { EXPORT_TAB_CANVAS_PREVIEW_STYLE } from "@/features/canvas/consts";
import useOnMountOnce from "@/hooks/useOnMountOnce";
import { toast } from "react-hot-toast";
import { useGraphPubSub } from "@/features/canvas/hooks/useGraphPubSub";

enum ExportFormat {
  PNG = "PNG",
  JPEG = "JPEG",
  // CSV = "CSV",
  // TXT = "TXT",
}

enum ExportLayer {
  Nodes = "nodes",
  Edges = "edges",
}

const previewSupportedFormats = [ExportFormat.PNG, ExportFormat.JPEG];

const ExportTab = () => {
  const { controlRef } = useCanvas();
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    ExportFormat.PNG
  );
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SupportedAlgorithms>(SupportedAlgorithms.ESMT);

  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState({
    [ExportLayer.Nodes]: true,
    [ExportLayer.Edges]: true,
  });

  if (!previewSupportedFormats.includes(exportFormat) && isPreviewActive) {
    setIsPreviewActive(false);
  }

  const [{ value: previewImageUrl, error, loading }, renderPreview] =
    useAsyncFn(
      async ({
        algorithm,
        layers,
      }: {
        algorithm: SupportedAlgorithms;
        layers: string[];
      }) => {
        const sigma = controlRef.current?.getSigma();
        if (!sigma) {
          throw new Error("Sigma instance not available/initialized");
        }
        const imageUrl = await graphCanvasToImageUrl(
          sigma,
          EXPORT_TAB_CANVAS_PREVIEW_STYLE,
          layers,
          [algorithm]
        );
        return imageUrl;
      },
      []
    );

  const getLayerList = (layers = selectedLayers) => {
    return Object.keys(layers).filter((layer) => layers[layer as ExportLayer]);
  };

  const handleGraphUpdates = useCallback(() => {
    console.log("rerender export preview");
    renderPreview({
      algorithm: selectedAlgorithm,
      layers: getLayerList(selectedLayers),
    });
  }, [selectedAlgorithm, selectedLayers]);

  useGraphPubSub(handleGraphUpdates);

  useOnMountOnce(() => {
    renderPreview({
      algorithm: selectedAlgorithm,
      layers: getLayerList(),
    });
  });

  const handleLayerChange = (layer: keyof typeof selectedLayers) => {
    const newLayers = {
      ...selectedLayers,
      [layer]: !selectedLayers[layer],
    };
    renderPreview({
      algorithm: selectedAlgorithm,
      layers: getLayerList(newLayers),
    });
    setSelectedLayers(newLayers);
  };
  const handleAlgorithmChange = (algorithm: SupportedAlgorithms) => {
    setSelectedAlgorithm(algorithm);
    renderPreview({
      algorithm,
      layers: getLayerList(),
    });
  };

  const handleDownload = async () => {
    let imageUrl = previewImageUrl;
    let filename;
    if (exportFormat === ExportFormat.PNG) {
      filename = "graph.png";
    } else if (exportFormat === ExportFormat.JPEG) {
      try {
        imageUrl = await addWhiteBackground(previewImageUrl!);
      } catch (error) {
        toast.error(
          "Failed to add white background to image. Downloading raw image."
        );
      }
      filename = "graph.jpeg";
    }
    const link = document.createElement("a");
    link.href = imageUrl!;
    link.download = filename!;
    link.target = "_blank";
    link.click();
    link.remove();
  };

  const isPreviewSupported = previewSupportedFormats.includes(exportFormat);
  return (
    <div className="flex flex-col gap-y-6 h-[inherit]">
      <div className="flex flex-col gap-y-1">
        <p className="font-semibold text-base text-black">Export graph</p>
        <div className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-sm font-medium">Select layers</p>
            <div className="space-y-2">
              {Object.values(ExportLayer).map((layer) => (
                <div className="flex items-center space-x-2" key={layer}>
                  <Checkbox
                    id={layer}
                    checked={selectedLayers[layer]}
                    onCheckedChange={() => handleLayerChange(layer)}
                  />
                  <Label htmlFor={layer} className="font-normal">
                    {capitalize(layer.replace("_", " "))}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="algorithm" className="font-medium text-sm">
              Algorithm
            </Label>
            <Select
              value={selectedAlgorithm}
              onValueChange={(value) =>
                handleAlgorithmChange(value as SupportedAlgorithms)
              }
            >
              <SelectTrigger id="algorithm" className="w-full">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SupportedAlgorithms).map((algorithm) => (
                  <SelectItem key={algorithm} value={algorithm}>
                    {algorithmDisplayProps[algorithm].title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="format" className="font-medium text-sm">
              Export Format
            </Label>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
            >
              <SelectTrigger id="format" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExportFormat).map((format) => (
                  <SelectItem key={format} value={format}>
                    .{format.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isPreviewSupported && (
            <div className="flex flex-col gap-y-2 items-start">
              <Button
                variant="icon"
                className={cn(
                  "flex gap-x-2 items-center p-0 font-normal text-text hover:text-active transition-colors",
                  isPreviewActive && "[&>svg]:rotate-0"
                )}
                role="button"
                onClick={() => setIsPreviewActive(!isPreviewActive)}
              >
                <ArrowDownFilledIcon className="-rotate-90 transition-all" />
                <p>Preview</p>
              </Button>
              <div
                className={cn(
                  "overflow-hidden w-full aspect-square h-0 transition-[height]",
                  isPreviewActive &&
                    "h-[calc(var(--sidebar-width)-2rem)] opacity-100"
                )}
              >
                <div className="flex w-full rounded-lg bg-accent p-3 items-center justify-center">
                  {error ? (
                    <p>Error loading preview</p>
                  ) : (
                    <div className={"h-auto bg-transparent w-full relative"}>
                      <div
                        className={cn(
                          "absolute loader -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2",
                          !loading && "paused"
                        )}
                      />
                      {previewImageUrl && (
                        <img
                          src={previewImageUrl}
                          alt="graph"
                          className={cn(
                            "h-auto bg-transparent w-full fade-in delay-500",
                            loading && "opacity-0 transition-none"
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={!previewImageUrl || loading} onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default ExportTab;
