import { CanvasContainer } from "./features/canvas";
import { Toaster } from "react-hot-toast";
import CanvasProvider from "./providers/canvas/CanvasProvider.tsx";
import Navbar from "./features/sidebar/components/Navbar.tsx";
import Sidebar from "./features/sidebar/components/Sidebar.tsx";
import FormSettingsProvider from "./providers/form-settings/FormSettingsProvider.tsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { GraphProvider } from "./providers/graph/GraphProvider";

export default function App() {
  return (
    <TooltipProvider>
      <GraphProvider>
        <div className="w-full h-full flex">
          <Navbar />
          <FormSettingsProvider>
            <CanvasProvider>
              <Sidebar />
              <CanvasContainer />
            </CanvasProvider>
          </FormSettingsProvider>
        </div>
      </GraphProvider>
      <Toaster />
    </TooltipProvider>
  );
}
