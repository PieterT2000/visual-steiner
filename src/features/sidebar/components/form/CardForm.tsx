import { SupportedAlgorithms } from "@/types.ts";
import { getRowKey } from "./layouts.config.ts";
import { getLabelFromFieldSchema, isNumber } from "./schema.ts";
import InputField from "./fields/InputField.tsx";
import ColorFields from "./fields/ColorFields.tsx";
import { algorithmCardFormLayoutMap } from "../../consts.ts";

const CardForm = ({ algorithm }: { algorithm: SupportedAlgorithms }) => {
  const { schema, layout } = algorithmCardFormLayoutMap[algorithm];
  return (
    <div className="flex flex-col gap-2.5">
      {layout.map((row) => {
        const rowKey = getRowKey(row);
        const gridTemplateColumns = row
          .map((item) => (typeof item === "string" ? "1fr" : `${item.width}%`))
          .join(" ");

        return (
          <div
            key={rowKey}
            className="grid grid-cols-2 gap-2 min-w-0 h-min row-span-1"
            style={{ gridTemplateColumns }}
          >
            {row.map((item) => {
              const key = typeof item === "string" ? item : item.id;
              const formKey = `${algorithm}.${key}`;
              // @ts-expect-error it is difficult to connect the types of schema and layout
              const fieldSchema = schema._def.shape()[key];
              const label = getLabelFromFieldSchema(fieldSchema);
              return key === "colors" ? (
                <ColorFields
                  key={formKey}
                  schema={fieldSchema}
                  algorithm={algorithm}
                />
              ) : (
                <InputField
                  className="flex flex-row gap-x-4 items-center space-y-0"
                  key={formKey}
                  label={label}
                  name={formKey}
                  type={isNumber(fieldSchema) ? "number" : "text"}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CardForm;
