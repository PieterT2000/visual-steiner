import { CanvasContainer } from "./features/canvas";
import { Toaster } from "react-hot-toast";
import CanvasProvider from "./providers/canvas/CanvasProvider.tsx";
import Navbar from "./features/sidebar/components/Navbar.tsx";
import Sidebar from "./features/sidebar/components/Sidebar.tsx";

export default function App() {
  return (
    <div className="w-full h-full flex">
      <Navbar />
      <CanvasProvider>
        <Sidebar />
        <CanvasContainer />
      </CanvasProvider>
      <Toaster />
    </div>
  );
}
