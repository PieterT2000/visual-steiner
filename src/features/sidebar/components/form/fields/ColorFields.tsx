import { z, ZodString } from "zod";
import ColorField from "./ColorField.tsx";
import { getLabelFromFieldSchema } from "../schema.ts";
import { cn } from "@/lib/utils.ts";
import { SupportedAlgorithms } from "@/types.ts";

interface ColorFieldsProps {
  schema: z.ZodObject<{
    [k: string]: ZodString;
  }>;
  fieldClassName?: string;
  className?: string;
  algorithm: SupportedAlgorithms;
}
const ColorFields = ({
  schema,
  className,
  fieldClassName,
  algorithm,
}: ColorFieldsProps) => {
  const nestedFieldKeys = schema.keyof().options as string[];
  return (
    <div className={cn("grid grid-cols-3 gap-2 row-span-1", className)}>
      {nestedFieldKeys.map((key) => {
        const fieldSchema = schema._def.shape()[key];
        const label = getLabelFromFieldSchema(fieldSchema);
        return (
          <ColorField
            className={fieldClassName}
            key={key}
            name={`${algorithm}.colors.${key}`}
            label={label}
          />
        );
      })}
    </div>
  );
};

export default ColorFields;
