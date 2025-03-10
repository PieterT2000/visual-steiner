import { Node } from "@/types";

export type ParserWarning = {
  message: string;
  cursor: number;
  value: string;
};

export interface Parser {
  parse(file: File): Promise<{
    nodes: Node[];
    warnings: ParserWarning[];
  }>;
}
