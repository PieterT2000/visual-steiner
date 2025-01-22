import { Button } from "@/components/ui/button.tsx";
import PlayIcon from "@/images/icons/play.svg?react";
import PencilIcon from "@/images/icons/pencil.svg?react";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import { cn } from "@/lib/utils.ts";
import { CanvasMode } from "./types.ts";
import { useState } from "react";

const canvasModeIconStyles =
  "h-8 w-8 rounded-full flex items-center justify-center text-active";
const canvasModeIconActiveStyles = "bg-white shadow-icon-bg";

const canvasModeIconMap = {
  [CanvasMode.Visualize]: <SteinerIcon />,
  [CanvasMode.Draw]: <PencilIcon />,
};

const CanvasNavigation = () => {
  const [canvasMode, setCanvasMode] = useState<CanvasMode>(
    CanvasMode.Visualize
  );

  return (
    <div className="w-canvas h-[68px] border-b px-5 flex items-center justify-between">
      <div />
      <div className="bg-accent flex rounded-[24px] gap-x-2 items-center px-1.5 py-1.5">
        {Object.values(CanvasMode).map((mode) => (
          <Button
            key={mode}
            className={cn(canvasModeIconStyles, {
              [canvasModeIconActiveStyles]: canvasMode === mode,
            })}
            onClick={() => setCanvasMode(mode)}
            variant={"icon"}
            size={"icon"}
          >
            {canvasModeIconMap[mode]}
          </Button>
        ))}
      </div>
      <Button className="px-4 py-2" size="lg">
        <PlayIcon />
        <span>Execute</span>
      </Button>
    </div>
  );
};

export default CanvasNavigation;
