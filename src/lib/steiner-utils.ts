import { wasmApi } from "./wasm-utils.ts";

export type SMTType = "euclidean" | "rectilinear";

export function calcSMT(terms: number[], type: SMTType = "euclidean") {
  const api = wasmApi;

  // convert numbers array to Float64 array
  const nterms = terms.length / 2; // terms is a flat array of x and y pairs
  const termsFloat64Arr = new Float64Array(terms);
  const n = termsFloat64Arr.length;
  const bytesPerFloat64 = termsFloat64Arr.BYTES_PER_ELEMENT;
  const bytesPerUint32 = Uint32Array.BYTES_PER_ELEMENT;

  const inputPtr = Module._malloc(n * bytesPerFloat64); // n * float64

  const lengthPtr = Module._malloc(bytesPerFloat64);
  const nspsPtr = Module._malloc(bytesPerUint32);
  const nedgesPtr = Module._malloc(bytesPerUint32);
  // Max number of Steiner points is n - 2, 2D coordinates
  const spsPtr = Module._malloc(2 * (nterms - 2) * bytesPerFloat64);
  // Max number of edges is 2n - 3
  // Edges are encoded as a flat array of int32 indices
  // where the indices of terminals have a range of [0, nterms -1)
  // and indices of Steiner points have a range of [nterms, ...)
  const edgesPtr = Module._malloc(2 * (2 * nterms - 3) * bytesPerUint32);

  // copy terminals to WASM memory
  Module.HEAPF64.set(termsFloat64Arr, inputPtr / bytesPerFloat64);
  const fn = type === "euclidean" ? api.calc_esmt : api.calc_rsmt;
  fn(nterms, inputPtr, lengthPtr, nspsPtr, spsPtr, nedgesPtr, edgesPtr);

  const length = Module.getValue(lengthPtr, "double");
  const nsps = Module.getValue(nspsPtr, "i32");
  const nedges = Module.getValue(nedgesPtr, "i32");

  // read sps and edges
  const sps = new Float64Array(Module.HEAPF64.buffer, spsPtr, nsps * 2);
  const edges = new Uint32Array(Module.HEAPU32.buffer, edgesPtr, nedges * 2);

  // Deallocate memory
  Module._free(inputPtr);
  Module._free(lengthPtr);
  Module._free(nspsPtr);
  Module._free(nedgesPtr);
  Module._free(spsPtr);
  Module._free(edgesPtr);

  return { length, nsps, nedges, sps, edges };
}
