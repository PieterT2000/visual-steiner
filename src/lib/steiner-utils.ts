import { wasmApi } from "./wasm-utils.ts";
import { Metric } from "@/types";

/**
 * The number of bytes per double in wasm32.
 * See the [docs](https://github.com/WebAssembly/design/blob/main/CAndC++.md)
 */
const BYTES_PER_WASM_DOUBLE = 8;
/**
 * The number of bytes per int in wasm32.
 * See the [docs](https://github.com/WebAssembly/design/blob/main/CAndC++.md)
 */
const BYTES_PER_WASM_INT = 4;

export function calcSMT(terms: number[], metric: Metric) {
  const api = wasmApi;

  // convert numbers array to Float64 array
  const n = terms.length;
  const nterms = n / 2; // terms is a flat array of x and y pairs
  const termsFloat64Arr = new Float64Array(terms);

  // Max number of Steiner points is n - 2, 2D coordinates
  const sPointsPtr = Module._malloc(2 * (nterms - 2) * BYTES_PER_WASM_DOUBLE);

  const inputPtr = Module._malloc(n * termsFloat64Arr.BYTES_PER_ELEMENT); // n * double

  // Max number of edges is 2n - 3
  // Edges are encoded as a flat array of int32 indices
  // where the indices of terminals have a range of [0, nterms -1)
  // and indices of Steiner points have a range of [nterms, ...)
  const edgesPtr = Module._malloc(2 * (2 * nterms - 3) * BYTES_PER_WASM_INT);

  const lengthPtr = Module._malloc(BYTES_PER_WASM_DOUBLE);
  const nspsPtr = Module._malloc(BYTES_PER_WASM_INT);
  const nedgesPtr = Module._malloc(BYTES_PER_WASM_INT);

  // copy terminals to WASM memory
  Module.HEAPF64.set(
    termsFloat64Arr,
    inputPtr / termsFloat64Arr.BYTES_PER_ELEMENT
  );
  const fn = metric === Metric.EUCLIDEAN ? api.calc_esmt : api.calc_rsmt;
  fn(nterms, inputPtr, lengthPtr, nspsPtr, sPointsPtr, nedgesPtr, edgesPtr);

  const length = Module.getValue(lengthPtr, "double");
  const nsps = Module.getValue(nspsPtr, "i32");
  const nedges = Module.getValue(nedgesPtr, "i32");

  // read sps and edges - THIS DOES NOT COPY THE BUFFER!
  const sPoints = new Float64Array(Module.HEAPF64.buffer, sPointsPtr, nsps * 2);
  const edges = new Int32Array(Module.HEAP32.buffer, edgesPtr, nedges * 2);

  // Copy the buffers to new arrays to avoid memory corruption when using the returned arrays
  // after the Module._free calls
  const spsCopy = new ArrayBuffer(sPoints.byteLength);
  const edgesCopy = new ArrayBuffer(edges.byteLength);
  new Float64Array(spsCopy).set(sPoints);
  new Int32Array(edgesCopy).set(edges);
  const spsCopyView = new Float64Array(spsCopy);
  const edgesCopyView = new Int32Array(edgesCopy);

  Module._free(inputPtr);
  Module._free(lengthPtr);
  Module._free(nspsPtr);
  Module._free(nedgesPtr);
  Module._free(sPointsPtr);
  Module._free(edgesPtr);

  return {
    length,
    nsps,
    nedges,
    sps: spsCopyView,
    edges: edgesCopyView,
  };
}
