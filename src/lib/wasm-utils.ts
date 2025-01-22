export function createWasmApi() {
  const api = {
    ping: Module.cwrap("ping", null, []),
    calc_esmt: Module.cwrap("calc_esmt", null, [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]),
    calc_rsmt: Module.cwrap("calc_rsmt", null, [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
    ]),
  };
  return api;
}

export const wasmApi = createWasmApi();
