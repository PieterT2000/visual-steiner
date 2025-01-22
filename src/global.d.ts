declare global {
  const Module: EmscriptenModule & {
    cwrap: typeof cwrap;
    getValue: typeof getValue;
    setValue: typeof setValue;
  };
}

export {};
