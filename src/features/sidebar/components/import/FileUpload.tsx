import { Button, TooltipButton } from "@/components/ui/button";
import UploadIcon from "@/images/upload.svg?react";
import {
  Dropzone,
  DropzoneInput,
  DropzoneZone,
} from "@/components/ui/dropzone";
import {
  FileList,
  FileListItem,
  FileListHeader,
  FileListIcon,
  FileListName,
  FileListSize,
  FileListInfo,
  FileListActions,
  FileListDescription,
  FileListAction,
} from "@/components/ui/file-list";
import { Trash2 } from "lucide-react";
import { FileRejection } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useCanvas } from "@/providers/canvas/CanvasContext";
import csvParser from "@/lib/input-parsers/csvParser";
import { useGraphContext } from "@/providers/graph/GraphContext";
import { graphFromNodes } from "@/lib/graph-utils";

const acceptedFileTypes = {
  "text/*": [".csv", ".txt"],
  "application/json": [".json"],
  "image/*": [".png", ".jpg", ".jpeg"],
};

enum FileType {
  CSV = ".csv",
  TXT = ".txt",
  JSON = ".json",
}

const fileVariants = [
  {
    value: ".csv",
    tooltip: "Download example",
    type: FileType.CSV,
    example: {
      url: "/example.csv",
      filename: "example.csv",
    },
  },
  {
    value: ".txt",
    tooltip: "Download example",
    type: FileType.TXT,
    example: {
      url: "/example.txt",
      filename: "example.txt",
    },
  },
];

const FileUpload = () => {
  const { files, setFiles, replaceGraphInContext } = useCanvas();
  const { setGraphSource } = useGraphContext();

  const handleDropRejected = (fileRejections: FileRejection[]) => {
    // show toast with rejection reason
    toast.error(fileRejections[0].errors[0].message);
  };

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter((f) => f !== file));
  };

  const handleImport = async () => {
    const file = files[0];
    // parse file based on type
    // update state
    if (file.type === "text/csv" || file.type === "text/plain") {
      const parser = csvParser;
      const result = await parser.parse(file);
      if (result.warnings.length > 0) {
        toast.error(result.warnings[0].message);
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
        return;
      }
      setGraphSource(file.name);
      const newGraph = graphFromNodes(result.nodes);
      replaceGraphInContext(newGraph);
      setFiles([]);
    }
  };

  const handleDownloadExampleFile = (
    variant: (typeof fileVariants)[number]
  ) => {
    const link = document.createElement("a");
    link.href = variant.example.url;
    link.download = variant.example.filename;
    link.target = "_blank";
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-y-4 h-[inherit]">
      <div className="flex flex-col gap-1">
        <p className="text-black font-semibold text-base">Import graph</p>
        <p className="text-text text-sm">
          Upload a compatible graph data file to display
        </p>
      </div>
      <Dropzone
        accept={acceptedFileTypes}
        onDropAccepted={setFiles}
        multiple={false}
        onDropRejected={handleDropRejected}
      >
        <div className="flex flex-col gap-y-3 h-[inherit]">
          <div className="flex flex-col gap-y-2 grow h-[inherit] w-full">
            <DropzoneZone className="h-[inherit] [stroke-dasharray:4,2] flex justify-center items-center gap-y-3 flex-col">
              <DropzoneInput />
              <UploadIcon />
              <div className="flex flex-col gap-y-1 text-sm">
                <span className="font-semibold text-active">
                  Drag file here
                </span>
                <span className="font-normal text-text">
                  or, click to browse
                </span>
              </div>
            </DropzoneZone>
            <div className="flex flex-row gap-x-2">
              <span className="text-xs leading-[18px] text-text">
                Supported data formats:{" "}
              </span>
              <div className="inline-flex flex-row gap-x-2">
                {fileVariants.map((variant) => (
                  <TooltipButton
                    tooltipProps={{ delayDuration: 200 }}
                    key={variant.value}
                    variant="link"
                    className="p-0 m-0 items-center gap-x-1 hover:no-underline h-min leading-[18px]"
                    onClick={() => handleDownloadExampleFile(variant)}
                    tooltip={variant.tooltip}
                  >
                    {variant.value}
                  </TooltipButton>
                ))}
              </div>
            </div>
          </div>
          <FileList>
            {files.map((file) => (
              <FileListItem key={file.name}>
                <FileListHeader>
                  <FileListIcon />
                  <FileListInfo>
                    <FileListName>{file.name}</FileListName>
                    <FileListDescription>
                      <FileListSize>{file.size}</FileListSize>
                    </FileListDescription>
                  </FileListInfo>
                  <FileListActions>
                    <FileListAction onClick={() => handleRemoveFile(file)}>
                      <Trash2 />
                      <span className="sr-only">Remove</span>
                    </FileListAction>
                  </FileListActions>
                </FileListHeader>
              </FileListItem>
            ))}
          </FileList>
        </div>
      </Dropzone>
      <div className="flex justify-end gap-x-2">
        {/* <Button variant="outline" className="h-10">
        Cancel
      </Button> */}
        <Button onClick={handleImport} disabled={!files.length}>
          Import
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
