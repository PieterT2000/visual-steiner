import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const useAlgorithmsForm = <T extends z.ZodType>(
  schema: T,
  defaultValues: z.infer<T>
) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return form;
};
