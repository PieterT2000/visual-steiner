import { wasmApi } from "./wasm-utils.ts";

export type SMTType = "euclidean" | "rectilinear";

export function calcSMT(terms: number[], type: SMTType = "euclidean") {
  const api = wasmApi;

  // convert numbers array to Float64 array
  const nvert = terms.length / 2;
  const float64Array = new Float64Array(terms);
  const n = float64Array.length;
  const bytesPerEl = float64Array.BYTES_PER_ELEMENT;

  const inputPtr = Module._malloc(n * bytesPerEl); // n * float64

  const termsPtr = Module._malloc(n * bytesPerEl); // n * float64
  const lengthPtr = Module._malloc(bytesPerEl); // float64
  const nspsPtr = Module._malloc(4); // int
  const nedgesPtr = Module._malloc(4); // int
  // Max number of Steiner points is n - 2, 2D coordinates
  const spsPtr = Module._malloc(2 * (nvert - 2) * bytesPerEl); // 2 * (n - 2) * float64
  // Max number of edges is 2n - 3, 2D coordinates
  const edgesPtr = Module._malloc(2 * (2 * nvert - 3) * 4); // 2 * (2 * n - 3) * int
  // ...
  // copy terms to WASM memory - sets the terms in the malloced memory starting at inputPtr
  Module.HEAPF64.set(terms, inputPtr / bytesPerEl);
  const fn = type === "euclidean" ? api.calc_esmt : api.calc_rsmt;
  fn(nvert, inputPtr, lengthPtr, nspsPtr, spsPtr, nedgesPtr, edgesPtr);

  const length = Module.getValue(lengthPtr, "double");
  const nsps = Module.getValue(nspsPtr, "i32");
  const nedges = Module.getValue(nedgesPtr, "i32");

  // read sps and edges
  const sps = new Float64Array(Module.HEAPF64.buffer, spsPtr, nsps * 2);
  const edges = new Uint32Array(Module.HEAPF64.buffer, edgesPtr, nedges * 2);

  // Cleanup
  Module._free(inputPtr);
  Module._free(termsPtr);
  Module._free(lengthPtr);
  Module._free(nspsPtr);
  Module._free(nedgesPtr);
  Module._free(spsPtr);
  Module._free(edgesPtr);

  return { length, nsps, nedges, sps, edges };
}
