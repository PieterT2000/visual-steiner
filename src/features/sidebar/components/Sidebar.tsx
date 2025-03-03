import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { cn } from "@/lib/utils.ts";
import ArrowDownFilledIcon from "@/images/icons/arrow_fown_filled.svg?react";
import { Accordion } from "@/components/ui/accordion";
import { SupportedAlgorithms } from "@/types.ts";
import AlgorithmCard from "./AlgorithmCard.tsx";
import { useFormContext } from "react-hook-form";
import { algorithmsFormSchema } from "./form/schema.ts";
import { z } from "zod";
import { useFormSettings } from "@/providers/form-settings/FormSettingsContext.ts";
import { Button } from "@/components/ui/button.tsx";
import PlusIcon from "@/images/icons/plus.svg?react";
import ImportTab from "./import/ImportTab.tsx";
enum Tab {
  Import = "Import",
  Algorithm = "Algorithms",
  Export = "Export",
}

const tabButtonStyles =
  "px-0 pb-2.5 pt-0 border-b-2 border-transparent rounded-none bg-transparent h-auto";
const tabButtonActiveStyles =
  "data-[state=active]:border-black data-[state=active]:text-active data-[state=active]:shadow-none";

const tabContentStyles = "mt-1 mr-[3px] ml-[3px]";

const Sidebar = () => {
  const selectedAlgorithms = [
    SupportedAlgorithms.ESMT,
    SupportedAlgorithms.PRIMS_MST,
    SupportedAlgorithms.RSMT,
  ];
  const form = useFormContext();
  const { activeAlgorithmCard, setActiveAlgorithmCard, formRef } =
    useFormSettings();

  const onSubmit = (_: z.infer<typeof algorithmsFormSchema>) => {
    // console.log("submitted values", values);
  };

  const formKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      // Stop form from submitting on pressing enter
      e.preventDefault();
    }
  };

  const accordionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Stop accordion from propagating enter keydown evt to ensure
    // accessibility navigation remains working when form has a preventDefault on enter
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  };

  return (
    <div className={cn("w-sidebar flex flex-col h-screen border-r")}>
      <div className="pt-5 pb-4 px-4">
        <h1 className="text-2xl font-medium text-black">Visual Steiner</h1>
      </div>
      <Tabs defaultValue={Tab.Algorithm} className="h-full flex flex-col">
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
        <TabsContent value={Tab.Algorithm} className={tabContentStyles}>
          <div className="py-4 px-[calc(1rem-3px)] flex flex-col gap-y-4">
            {/* TODO: make this a toggle */}
            <div className="flex gap-x-2 items-center">
              <ArrowDownFilledIcon />
              <p>Active layers</p>
            </div>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={formKeyDown}
              ref={formRef}
            >
              <Accordion
                type="single"
                collapsible
                className="w-full flex flex-col gap-y-4"
                onKeyDown={accordionKeyDown}
                value={activeAlgorithmCard}
                onValueChange={(value) =>
                  setActiveAlgorithmCard(value as SupportedAlgorithms)
                }
              >
                {selectedAlgorithms.map((algorithm) => (
                  <AlgorithmCard key={algorithm} algorithm={algorithm} />
                ))}
              </Accordion>
            </form>
            <Button
              className="flex gap-x-2 items-center p-0 pl-1 justify-start text-text"
              variant="link"
            >
              <PlusIcon />
              <p>Add algorithm/layer</p>
            </Button>
          </div>
        </TabsContent>
        <TabsContent
          value={Tab.Import}
          className={cn(tabContentStyles, "grow")}
        >
          <div className="py-4 px-[calc(1rem-3px)] h-full">
            <ImportTab />
          </div>
        </TabsContent>
        <TabsContent value={Tab.Export} className={tabContentStyles}>
          <div>
            <h2>Export</h2>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
