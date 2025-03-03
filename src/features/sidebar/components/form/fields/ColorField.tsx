import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useFormContext } from "react-hook-form";
import ColorPicker from "../ColorPicker.tsx";

interface ColorFieldProps {
  name: string;
  label?: string;
  className?: string;
}

const ColorField = ({ name, label, className }: ColorFieldProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <ColorPicker
                {...field}
                value={field.value}
                onChange={field.onChange}
                className="w-[37px] h-[37px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ColorField;
