import Canvas from "./Canvas.tsx";
import CanvasNavigation from "./CanvasNavigation.tsx";

const CanvasContainer = () => {
  return (
    <div className="w-canvas h-screen flex flex-col">
      <CanvasNavigation />
      <Canvas />
    </div>
  );
};

export default CanvasContainer;
