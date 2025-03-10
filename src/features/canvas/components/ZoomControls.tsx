import { useCamera } from "@react-sigma/core";
// Import zoom in, zoom  out, zoom center icons
import Zoomin from "@/images/icons/zoom_in.svg?react";
import Zoomout from "@/images/icons/zoom_out.svg?react";
import Zoomcenter from "@/images/icons/zoom_center.svg?react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canvasBox } from "./tw-classes";
import { GRAPH_DEFAULT_SETTINGS } from "../consts";
import Sigma from "sigma";
import useOnMountOnce from "@/hooks/useOnMountOnce";
const zoomControlContainerPosition = "absolute bottom-4 left-[22px]";
const zoomControlButton = "gap-0 size-6 text-active hover:text-primary";
const ZoomControls = ({
  animationDuration = 200,
  sigmaRef,
}: {
  animationDuration?: number;
  sigmaRef: React.RefObject<Sigma>;
}) => {
  const { zoomIn, zoomOut } = useCamera({
    factor: GRAPH_DEFAULT_SETTINGS.cameraFitRatio,
  });

  const handleReset = () => {
    sigmaRef.current?.getCamera().animate(
      {
        x: 0.5,
        y: 0.5,
        ratio: GRAPH_DEFAULT_SETTINGS.cameraFitRatio,
      },
      { duration: animationDuration }
    );
  };

  useOnMountOnce(() => {
    handleReset();
  });

  return (
    <div
      className={cn(
        canvasBox,
        "gap-y-4 py-3 px-2",
        zoomControlContainerPosition
      )}
    >
      <Button
        variant="icon"
        size="icon"
        onClick={() => zoomIn()}
        className={zoomControlButton}
      >
        <Zoomin />
      </Button>
      <Button
        variant="icon"
        size="icon"
        onClick={() => zoomOut()}
        className={zoomControlButton}
      >
        <Zoomout />
      </Button>
      <Button
        variant="icon"
        size="icon"
        onClick={handleReset}
        className={zoomControlButton}
      >
        <Zoomcenter />
      </Button>
    </div>
  );
};

export default ZoomControls;
