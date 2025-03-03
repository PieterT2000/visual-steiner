import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[38px] w-full rounded-md border border-inputBorder bg-white text-text px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none shadow-primary/25 focus-visible:border-primary/50 focus-within:border-primary/50 focus-visible:shadow-inputFocus focus-within:shadow-inputFocus focus-within:text-active focus-visible:text-active disabled:cursor-not-allowed disabled:opacity-50",
          !disabled && "hover:border-primary/40 hover:text-active",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
