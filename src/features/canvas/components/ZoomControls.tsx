import { useCamera } from "@react-sigma/core";
// Import zoom in, zoom  out, zoom center icons
import Zoomin from "@/images/icons/zoom_in.svg?react";
import Zoomout from "@/images/icons/zoom_out.svg?react";
import Zoomcenter from "@/images/icons/zoom_center.svg?react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { canvasBox } from "./tw-classes";

const zoomControlContainerPosition = "absolute bottom-4 left-[22px]";
const zoomControlButton = "gap-0 size-6 text-active hover:text-primary";
const ZoomControls = ({
  animationDuration = 200,
}: {
  animationDuration?: number;
}) => {
  const { zoomIn, zoomOut, reset } = useCamera({
    duration: animationDuration,
    factor: 1.5,
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
        onClick={() => reset()}
        className={zoomControlButton}
      >
        <Zoomcenter />
      </Button>
    </div>
  );
};

export default ZoomControls;
