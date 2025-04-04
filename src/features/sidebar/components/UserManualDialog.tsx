import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserManualDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserManualDialog: React.FC<UserManualDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-active">User Manual</DialogTitle>
          <DialogDescription className="pt-4 text-text">
            <h3 className="text-base font-semibold mb-2 text-active">
              Basic Graph Editing
            </h3>
            <p className="mb-4">
              The Visual Steiner Tree Tool allows you to create and edit graphs
              directly on the canvas:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <span className="text-active font-medium">Left-click</span> on
                the canvas to add new terminal points
              </li>
              <li>
                <span className="text-active font-medium">Drag</span> existing
                nodes to move them
              </li>
              <li>
                <span className="text-active font-medium">Right-click</span> on
                a node to delete it
              </li>
            </ul>

            <h3 className="text-base font-semibold mb-2 text-active">
              Live Edit Mode
            </h3>
            <p className="mb-4">
              To see how the Steiner tree and the Steiner ratio change as you
              edit the graph, by adding, moving, and deleting terminals:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                Switch to{" "}
                <span className="text-active font-medium">Live Edit Mode</span>{" "}
                from the canvas mode selector
              </li>
              <li>Edit your graph using the methods above</li>
              <li>
                Observe how the Steiner Minimal Tree (SMT) and Minimum Spanning
                Tree (MST) update in real-time, and how the Steiner ratio
                changes.
              </li>
            </ol>

            <p className="text-sm italic">
              The Steiner ratio is the ratio between the length of the Steiner
              Minimal Tree and the length of the Minimum Spanning Tree. This
              value can be at most 1, at which point the Steiner Minimal Tree is
              equal to the Minimum Spanning Tree. The smaller the ratio, the
              greater the improvement provided by the Steiner Minimal Tree.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserManualDialog;
