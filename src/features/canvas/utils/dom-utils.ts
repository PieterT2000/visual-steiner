import { themeHexColors } from "@/theme";
import { SupportedAlgorithms } from "@/types";
import { Sigma } from "sigma";
import {
  isEdgeUsedByVisibleAlgorithms,
  isNodeUsedByVisibleAlgorithms,
  isSteinerNode,
} from "@/lib/graph-utils";

export function getRelativeMousePosition<T extends HTMLElement>(
  event: MouseEvent,
  container: T
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

export async function graphCanvasToImageUrl(
  sigma: Sigma,
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  const layers = ["edges", "nodes"];
  const blob = await canvasToPngBlob(sigma, layers, visibleAlgorithms);
  if (blob) {
    return URL.createObjectURL(blob);
  }
  return null;
}

/**
 * There is a bug I can't find sources about, that makes it impossible to render
 * WebGL canvases using `#drawImage` as long as they appear onscreen. There are
 * basically two solutions:
 * 1. Use `webGLContext#readPixels`, transform it to an ImageData, put that
 *    ImageData in another canvas, and draw this canvas properly using
 *    `#drawImage`
 * 2. Hide the sigma instance
 * 3. Create a new sigma instance similar to the initial one (dimensions,
 *    settings, graph, camera...), use it and kill it
 * This exemple uses this last solution.
 */
async function canvasToPngBlob(
  renderer: Sigma,
  inputLayers?: string[],
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  const width = 256;
  const height = 256;

  const tmpRoot = document.createElement("div");
  tmpRoot.style.width = `${width}px`;
  tmpRoot.style.height = `${height}px`;
  tmpRoot.style.position = "absolute";
  tmpRoot.style.right = "101%";
  tmpRoot.style.bottom = "101%";
  document.body.appendChild(tmpRoot);

  // Instantiate sigma:
  const tmpRenderer = new Sigma(
    renderer.getGraph().copy(),
    tmpRoot,
    renderer.getSettings()
  );
  tmpRenderer.setSetting("nodeReducer", (_, data) => {
    return {
      ...data,
      size: 6,
      color: themeHexColors.primary,
      // Hide any Steiner nodes not used by visible-toggled algorithms
      // All other nodes should be visible
      hidden:
        isSteinerNode(data) &&
        !isNodeUsedByVisibleAlgorithms(data, visibleAlgorithms),
    };
  });

  tmpRenderer.setSetting("edgeReducer", (_, data) => {
    return {
      ...data,
      size: 5,
      color: themeHexColors.primary,
      // Hide any edges not used by visible-toggled algorithms
      hidden: !isEdgeUsedByVisibleAlgorithms(data, visibleAlgorithms),
    };
  });

  // Copy camera and force to render now, to avoid having to wait the schedule /
  // debounce frame:
  tmpRenderer.getCamera().setState({
    x: 0.5,
    y: 0.5,
    ratio: 1,
    angle: 0,
  });
  tmpRenderer.refresh();

  // Create a new canvas, on which the different layers will be drawn:
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.setAttribute("width", width + "");
  canvas.setAttribute("height", height + "");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Draw a transparent background first:
  ctx.fillStyle = "rgba(255, 255, 255, 0)";
  ctx.fillRect(0, 0, width, height);

  // For each layer, draw it on our canvas:
  const canvases = tmpRenderer.getCanvases();
  const layers = inputLayers
    ? inputLayers.filter((id) => !!canvases[id])
    : Object.keys(canvases);
  layers.forEach((id) => {
    ctx.drawImage(canvases[id], 0, 0, width, height, 0, 0, width, height);
  });

  return new Promise<Blob>((resolve, reject) => {
    // Save the canvas as a PNG image:
    canvas.toBlob((blob) => {
      // Cleanup:
      tmpRenderer.removeAllListeners();
      tmpRenderer.kill();
      tmpRoot.remove();
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    }, "image/png");
  });
}
