import React from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input"; // Adjust the import path as needed

interface InputFieldProps {
  name: string;
  label?: string;
  type?: string;
  className?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  className,
  placeholder,
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value = getTypedValue(type, field.value, field.value);
        return (
          <FormItem className={className}>
            {label && <FormLabel className="w-full">{label}</FormLabel>}
            <div className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  value={value ?? ""}
                  type={type}
                  onChange={(e) => {
                    const value =
                      type === "number"
                        ? e.target.valueAsNumber
                        : e.target.value;
                    field.onChange(value);
                  }}
                  placeholder={placeholder}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;

function getTypedValue<T>(type: string, value: T, defaultValue: T) {
  if (type === "number") {
    const n = Number(value);
    return !isNaN(n) ? n : defaultValue;
  }
  return value;
}
