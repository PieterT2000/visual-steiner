import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { cn } from "@/lib/utils.ts";
import ArrowDownFilledIcon from "@/images/icons/arrow_fown_filled.svg?react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SteinerIcon from "@/images/icons/steiner.svg?react";
import EyeIcon from "@/images/icons/eye.svg?react";
import RectangleIcon from "@/images/icons/rectangle.svg?react";
import { Button } from "@/components/ui/button.tsx";

// import { useCanvas } from "@/providers/canvas/CanvasContext.ts";
// import { SupportedAlgorithms } from "@/types.ts";

enum Tab {
  Algorithm = "Algorithms",
  Analysis = "Analysis",
  Export = "Export",
}

const tabButtonStyles =
  "px-0 pb-2.5 pt-0 border-b-2 border-transparent rounded-none bg-transparent h-auto";
const tabButtonActiveStyles =
  "data-[state=active]:border-black data-[state=active]:text-active data-[state=active]:shadow-none";

const Sidebar = () => {
  // const { setActiveAlgorithm } = useCanvas();
  return (
    <div className={cn("w-sidebar flex flex-col h-screen border-r")}>
      <div className="pt-5 pb-4 px-4">
        <h1 className="text-2xl font-medium text-black">Visual Steiner</h1>
      </div>
      <Tabs defaultValue={Tab.Algorithm}>
        <TabsList className="px-4 py-0 h-10 border-b w-full bg-transparent gap-x-3 items-end rounded-none justify-start">
          {Object.values(Tab).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(tabButtonStyles, tabButtonActiveStyles)}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={Tab.Algorithm}
          className="p-4 mt-1 flex flex-col gap-y-4"
        >
          {/* TODO: make this a toggle */}
          <div className="flex gap-x-2 items-center">
            <ArrowDownFilledIcon />
            <p>Active layers</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="item-1"
              className="border rounded-lg bg-white"
            >
              <AccordionTrigger className="p-2 justify-normal">
                <div className="flex gap-x-3 items-center">
                  <span className="flex items-center justify-center h-7 w-7 bg-layer1 rounded-lg text-white">
                    <SteinerIcon />
                  </span>
                  <p className="hover:underline transition-all hover:text-active">
                    Euclidian Steiner minimal tree (ESMT)
                  </p>
                </div>
                <div
                  role="button"
                  className="ml-auto mr-2 hover:text-active transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EyeIcon />
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3">
                <span>Edge width</span>
                {/* <Input type="number" /> */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value={Tab.Analysis}>
          <div>
            <h2>Analysis</h2>
          </div>
        </TabsContent>
        <TabsContent value={Tab.Export}>
          <div>
            <h2>Export</h2>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
