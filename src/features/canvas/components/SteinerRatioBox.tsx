import { canvasBox } from "./tw-classes";
import { cn } from "@/lib/utils";
import { Metric } from "@/types";
import { AlgorithmSolution } from "../types";
import useCalculateSteinerRatio from "../hooks/useCalculateRatio";
import { getBucket, roundTo, getGradientColor } from "@/lib/math-utils";
import EuclideanSteinerRatioEqImg from "@/images/e_steiner_ratio.png";
import RectilinearSteinerRatioEqImg from "@/images/r_steiner_ratio.png";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext";
import { useRef, useEffect, useState } from "react";

const widgetWidth = "w-[250px]";
const boxPosition = "absolute bottom-4 right-[22px]";

const CONJECTURED_EUCLIDEAN_STEINER_RATIO = Math.sqrt(3) / 2;
const RECTILINEAR_STEINER_RATIO = 2 / 3;

/*
  Returns a label and color for the Rectilinear Steiner ratio depending on where it is in the range [2/3, 1]
*/
const getRectilinearBoundInfo = (value: number | undefined) => {
  if (value === undefined) {
    return "No solutions yet";
  }
  const bucket = getBucket({
    min: RECTILINEAR_STEINER_RATIO,
    max: 1,
    size: 6,
    value,
  });
  if (bucket === 0 || bucket === 1) {
    return "Great ratio";
  } else if (bucket === 2 || bucket === 3) {
    return "Fair ratio";
  }
  return "Suboptimal ratio - close to MST length";
};

/*
  Returns a label and color for the Euclidean Steiner ratio depending on where it is in the range [sqrt(3)/2, 1]
*/
const getEuclideanBoundInfo = (value: number | undefined) => {
  if (value === undefined) {
    return "No solutions yet";
  }
  const bucket = getBucket({
    min: CONJECTURED_EUCLIDEAN_STEINER_RATIO,
    max: 1,
    size: 6,
    value,
  });
  if (value === CONJECTURED_EUCLIDEAN_STEINER_RATIO) {
    return "Equal to conjectured";
  } else if (value < CONJECTURED_EUCLIDEAN_STEINER_RATIO) {
    return "Lower than conjectured!";
  } else if (bucket === 0 || bucket === 1) {
    return "Great ratio";
  } else if (bucket === 2 || bucket === 3) {
    return "Fair ratio";
  }
  return "Suboptimal ratio - close to MST length";
};

/**
 * Calculates the position percentage (0-100) for a ratio value within its metric's bounds
 */
const getRatioPosition = (value: number, metric: Metric): number => {
  const minRatio =
    metric === Metric.EUCLIDEAN
      ? CONJECTURED_EUCLIDEAN_STEINER_RATIO
      : RECTILINEAR_STEINER_RATIO;
  const maxRatio = 1;

  // Clamp the value between min and max
  const clampedValue = Math.max(minRatio, Math.min(maxRatio, value));

  // Calculate position percentage
  return ((clampedValue - minRatio) / (maxRatio - minRatio)) * 100;
};

const SteinerRatioBox = ({ solutions }: { solutions: AlgorithmSolution[] }) => {
  const { metric } = useFormSettings();
  const steinerRatio = useCalculateSteinerRatio(solutions, metric);
  const value = steinerRatio?.meta.ratio;
  const boundLabel =
    metric === Metric.EUCLIDEAN
      ? getEuclideanBoundInfo(value)
      : getRectilinearBoundInfo(value);

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState("-50%");
  const [gradientColor, setGradientColor] = useState("text-text");

  useEffect(() => {
    if (!textRef.current || !containerRef.current || value === undefined)
      return;

    const textWidth = textRef.current.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;
    const position = getRatioPosition(value, metric);
    const positionInPixels = (position / 100) * containerWidth;

    const halfTextWidth = textWidth / 2;
    const spaceLeft = positionInPixels - halfTextWidth;
    const spaceRight = containerWidth - (positionInPixels + halfTextWidth);

    if (spaceRight < 0) {
      setTranslateX(`calc(-100% + ${containerWidth - positionInPixels}px)`);
    } else if (spaceLeft < 0) {
      setTranslateX(`-${Math.max(0, positionInPixels)}px`);
    } else {
      setTranslateX("-50%");
    }

    // Update gradient color based on position
    setGradientColor(getGradientColor(position));
  }, [value, metric]);

  return (
    <div className={cn(canvasBox, boxPosition, widgetWidth, "p-3 gap-y-2")}>
      <div className="text-lg font-medium text-active flex items-center justify-between">
        <span className="shrink-0">Steiner Ratio</span>
        <img
          src={
            metric === Metric.EUCLIDEAN
              ? EuclideanSteinerRatioEqImg
              : RectilinearSteinerRatioEqImg
          }
          alt="ratio_eq"
          className="max-w-[100px]"
        />
      </div>

      {value === undefined ? (
        <div className="text-sm text-text">
          No solutions yet, click on the "Execute" button to generate solutions
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="h-[40px] flex items-end">
            <div
              ref={containerRef}
              className="relative h-[10px] w-full rounded-lg bg-gradient-to-r from-success via-warning to-error"
            >
              {value !== undefined && (
                <>
                  <div
                    className="absolute bottom-0 w-0.5 bg-black h-[12px] transition-all duration-300 ease-in-out"
                    style={{
                      left: `${getRatioPosition(value, metric)}%`,
                    }}
                  />
                  <div
                    ref={textRef}
                    className="absolute -top-8 text-2xl font-bold whitespace-nowrap transition-all duration-300 ease-in-out"
                    style={{
                      left: `${getRatioPosition(value, metric)}%`,
                      transform: `translateX(${translateX})`,
                      color: gradientColor,
                    }}
                  >
                    {roundTo(value, 4)}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={cn("text-xs text-text")}>{boundLabel}</div>
        </div>
      )}
    </div>
  );
};

export default SteinerRatioBox;
