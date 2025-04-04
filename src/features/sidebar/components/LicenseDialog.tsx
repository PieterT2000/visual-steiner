import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LicenseDialog: React.FC<LicenseDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-active">
            GeoSteiner Attribution
          </DialogTitle>
          <DialogDescription className="pt-4">
            <p className="mb-4">
              This project makes use of the{" "}
              <a
                href="http://geosteiner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GeoSteiner
              </a>{" "}
              library, developed by{" "}
              <a
                href="http://www.warme.net/david/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                David Warme
              </a>
              ,{" "}
              <a
                href="https://di.ku.dk/Ansatte/?pure=da/persons/86225"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Pawel Winter
              </a>
              , and{" "}
              <a
                href="https://www.pure.fo/en/persons/martin-tvede-zachariasen-2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Martin Zachariasen
              </a>
              , for computing Steiner minimal trees.
            </p>
            <p className="mb-4">
              Its license can be found{" "}
              <a
                href="http://www.geosteiner.com/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                here
              </a>
              .
            </p>
            <p>
              Modifications were made to the GeoSteiner code to enable the
              compilation of the code to WebAssembly.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseDialog;
