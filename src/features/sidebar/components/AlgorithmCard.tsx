import {
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion.tsx";
import EyeIcon from "@/images/icons/eye.svg?react";
import EyeOffIcon from "@/images/icons/eye_off.svg?react";
import { algorithmDisplayProps } from "@/components/display-props.tsx";

import CardForm from "./form/CardForm.tsx";
import { SupportedAlgorithms } from "@/types.ts";
import { cn } from "@/lib/utils.ts";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext.ts";

interface AlgorithmCardProps {
  algorithm: SupportedAlgorithms;
}

const AlgorithmCard = ({ algorithm }: AlgorithmCardProps) => {
  const { algorithmVisibility, setAlgorithmVisibility } = useFormSettings();

  const handleVisibilityChange = <T extends HTMLElement>(
    evt: React.MouseEvent<T>
  ) => {
    evt.stopPropagation();
    setAlgorithmVisibility((prev) => {
      const currentAlgo = prev.find(
        (visibility) => visibility.algorithm === algorithm
      );
      if (currentAlgo) {
        currentAlgo.visible = !currentAlgo.visible;
      }
    });
  };

  const isCurrentAlgoVisible = algorithmVisibility.find(
    (visibility) => visibility.algorithm === algorithm
  )?.visible;

  return (
    <AccordionItem value={algorithm} className="border rounded-lg bg-white">
      <AccordionTrigger className="p-2 justify-normal gap-x-2">
        <div className="flex gap-x-3 items-center">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg text-white",
              algorithmDisplayProps[algorithm].bg
            )}
          >
            {algorithmDisplayProps[algorithm].icon}
          </span>
          <p className="hover:underline transition-all hover:text-active">
            {algorithmDisplayProps[algorithm].title}
          </p>
        </div>
        <div
          role="button"
          className="ml-auto mr-2 hover:text-active transition-colors"
          onClick={handleVisibilityChange}
        >
          {isCurrentAlgoVisible ? <EyeIcon /> : <EyeOffIcon />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-3">
        <CardForm algorithm={algorithm} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default AlgorithmCard;
