import { Edge, Node } from "@/types";
import { Parser, ParserWarning } from "./types";
import Papa, { parse } from "papaparse";
import { nanoid as generateId } from "nanoid";

const csvParser: Parser = {
  parse: async (file: File) => {
    return new Promise((resolve, reject) => {
      const nodes: Node[] = [];
      const warnings: ParserWarning[] = [];
      parse(file, {
        header: false,
        worker: true,
        dynamicTyping: true,
        comments: "#",
        skipEmptyLines: true,
        delimitersToGuess: [
          " ",
          ",",
          "\t",
          "|",
          ";",
          Papa.RECORD_SEP,
          Papa.UNIT_SEP,
        ],
        error(error) {
          reject(error);
        },
        step(row) {
          if (row.errors.length > 0) {
            reject(row.errors);
          }
          const data = row.data as (null | number)[];
          const filteredData = data.filter((value) => value !== null);
          const x = filteredData[0];
          const y = filteredData[1];
          if (isNaN(x) || isNaN(y)) {
            warnings.push({
              message:
                "Could not parse x or y as numbers. Please upload a valid file",
              cursor: row.meta.cursor,
              value: `${x},${y}`,
            });
            return;
          }
          nodes.push({
            key: generateId(),
            x,
            y,
          });
        },
        complete: () => {
          resolve({
            nodes,
            warnings,
          });
        },
      });
    });
  },
};

export default csvParser;
