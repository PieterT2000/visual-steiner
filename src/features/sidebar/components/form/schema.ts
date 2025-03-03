import { SupportedAlgorithms } from "@/types.ts";
import { z } from "zod";

export const steinerFormSchema = z.object({
  edgeWidth: z.number().min(1).describe("Edge width"),
  vertexRadius: z.number().min(1).describe("Vertex radius"),
  maxCpuTime: z.number().min(500).describe("Max solver CPU time (ms)"),
  colors: z.object({
    vertex: z.string().describe("Vertex"),
    edge: z.string().describe("Edge"),
    steinerVertex: z.string().describe("Steiner point"),
  }),
});

export const uniformOrientSteinerFormSchema = steinerFormSchema.extend({
  lambda: z.number().min(2).max(6).describe("Lambda metric λ"),
});

export const mstFormSchema = steinerFormSchema.extend({
  colors: steinerFormSchema._def.shape().colors.omit({
    steinerVertex: true,
  }),
});

type UniformOrientSteinerFormSchema = z.infer<
  typeof uniformOrientSteinerFormSchema
>;
type SteinerFormSchema = z.infer<typeof steinerFormSchema>;
type MSTFormSchema = z.infer<typeof mstFormSchema>;

export type {
  UniformOrientSteinerFormSchema,
  SteinerFormSchema,
  MSTFormSchema,
};

export const algorithmsFormSchema = z.object({
  [SupportedAlgorithms.ESMT]: steinerFormSchema.optional(),
  [SupportedAlgorithms.RSMT]: steinerFormSchema.optional(),
  [SupportedAlgorithms.UOSMT]: uniformOrientSteinerFormSchema.optional(),
  [SupportedAlgorithms.PRIMS_MST]: mstFormSchema.optional(),
});

export type AlgorithmsFormSchema = z.infer<typeof algorithmsFormSchema>;

export const getLabelFromFieldSchema = (fieldSchema: z.ZodTypeAny) => {
  return fieldSchema.description;
};

const numberTypeName = z.number()._def.typeName;
const unionTypeName = z.union([z.enum([""]), z.null()])._def.typeName;

export function isNumber(value: z.ZodTypeAny): value is z.ZodNumber {
  return (
    value &&
    (value._def.typeName === numberTypeName ||
      (value._def.typeName === unionTypeName &&
        value._def.options.some(isNumber)) ||
      isNumber(value._def.innerType) ||
      isNumber(value._def.schema))
  );
}
