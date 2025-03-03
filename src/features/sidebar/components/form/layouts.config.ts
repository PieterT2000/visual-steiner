import {
  mstFormSchema,
  steinerFormSchema,
  uniformOrientSteinerFormSchema,
} from "./schema.ts";

type FieldConfig<TKeys> = {
  /**
   * Width of the column in the layout
   * The number should a percentage in the range [1, 100]
   * @type {number}
   */
  width: number;
  id: TKeys;
};
type UniformArray<T> = T[];
type RowType<T> = UniformArray<T | FieldConfig<T>>;
export type LayoutConfig<T> = RowType<T>[];

const steinerFormFieldKeys = steinerFormSchema.keyof().options;
type SteinerFormFieldKeys = (typeof steinerFormFieldKeys)[number];
const uniformlyOrientedFormFieldKeys =
  uniformOrientSteinerFormSchema.keyof().options;
type UniformlyOrientedFormFieldKeys =
  (typeof uniformlyOrientedFormFieldKeys)[number];
const mstFormFieldKeys = mstFormSchema.keyof().options;
type MSTFormFieldKeys = (typeof mstFormFieldKeys)[number];

export const steinerFormLayoutConfig: LayoutConfig<SteinerFormFieldKeys> = [
  ["maxCpuTime"],
  ["edgeWidth"],
  ["vertexRadius"],
  ["colors"],
];

export const uniformlyOrientedFormLayoutConfig: LayoutConfig<UniformlyOrientedFormFieldKeys> =
  [["lambda"], ["maxCpuTime"], ["edgeWidth"], ["vertexRadius"], ["colors"]];

export const mstFormLayoutConfig: LayoutConfig<MSTFormFieldKeys> = [
  ["maxCpuTime"],
  ["edgeWidth"],
  ["vertexRadius"],
  ["colors"],
];

export const getRowKey = <T extends string>(row: LayoutConfig<T>[number]) => {
  return row.map((col) => (typeof col === "string" ? col : col.id)).join("-");
};
