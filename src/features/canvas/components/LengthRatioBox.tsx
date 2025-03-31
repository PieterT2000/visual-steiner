import { algorithmDisplayProps } from "@/components/display-props";
import { canvasBox } from "./tw-classes";
import { cn } from "@/lib/utils";
import { SupportedAlgorithms } from "@/types";
import useOrderedList from "../../../hooks/useOrderedList";
import { AlgorithmSolution } from "../types";
import useCalculateRatio from "../hooks/useCalculateRatio";
import { roundTo } from "@/lib/math-utils";
import RatioEqImg from "@/images/ratio_eq.png";
import { useUpdatedSolutionLengths } from "../hooks/useUpdatedSolutionLengths";
import { useCanvas } from "@/providers/canvas/CanvasContext";
const widgetWidth = "w-[250px]";
const boxPosition = "absolute bottom-4 right-[22px]";

const LengthRatioBox = ({ solutions }: { solutions: AlgorithmSolution[] }) => {
  const { graph } = useCanvas();
  const updatedSolutions = useUpdatedSolutionLengths(solutions, graph);
  // compute ratio for each solution
  const solutionsWithRatio = useCalculateRatio(updatedSolutions);
  const orderedResults = useOrderedList(
    solutionsWithRatio,
    (solution) => solution.meta.ratio
  );
  return (
    <div className={cn(canvasBox, boxPosition, widgetWidth, "p-3 gap-y-2")}>
      <div className="text-base font-medium text-black flex items-center justify-between">
        <span className="shrink-0">Length Ratio</span>
        <img src={RatioEqImg} alt="ratio_eq" className="max-w-[110px]" />
      </div>
      {orderedResults.map((solution, idx) => (
        <BoxItem
          key={solution.algorithm}
          algorithm={solution.algorithm}
          value={solution.meta.ratio}
          idx={idx}
        />
      ))}
      {orderedResults.length === 0 && (
        <div className="text-sm text-text">
          No solutions yet, click on the "Execute" button to generate solutions
        </div>
      )}
    </div>
  );
};

interface BoxItemProps {
  algorithm: SupportedAlgorithms;
  value: number;
  idx: number;
}

const medalEmojis = ["🥇", "🥈", "🥉"];

const BoxItem = ({ algorithm, value, idx }: BoxItemProps) => {
  const displayProps = algorithmDisplayProps[algorithm];
  const medal = idx < medalEmojis.length ? medalEmojis[idx] : "";
  const isActive = idx === 0;
  const shadowColor = isActive ? "shadow-primary/15 " : "";
  return (
    <div
      className={
        // This cannot be added to the cn function because it won't apply the shadow-color and shadow-canvasBoxItem classes
        // together, but filter one out due to the same prefix 'shadow-'
        shadowColor +
        cn(
          "bg-white rounded-lg border border-black/10 flex gap-x-2 p-2 justify-between",
          isActive && "bg-primary/15 border-primary/10 shadow-canvasBoxItem"
        )
      }
    >
      <div className="flex items-center gap-x-2">
        <span
          className={cn(
            "flex items-center justify-center h-7 w-7 rounded-lg text-white",
            displayProps.bg
          )}
        >
          {displayProps.icon}
        </span>
        <div className="text-sm font-medium text-text">
          {displayProps.shortTitle}{" "}
          {algorithm === SupportedAlgorithms.PRIMS_EMST ? "(base)" : ""}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <span className="text-sm leading-4 font-semibold text-active">
          {roundTo(value, 2).toString()}
        </span>
        {medal ? (
          <span className="text-xl leading-5">{medal}</span>
        ) : (
          <span className="block w-[22px] h-[20px]"></span>
        )}
      </div>
    </div>
  );
};

export default LengthRatioBox;
