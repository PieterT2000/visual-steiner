import { render, waitFor } from "@testing-library/react";
import { useUpdatedSolutionLengths } from "../hooks/useUpdatedSolutionLengths";
import { SupportedAlgorithms } from "@/types";
import { describe, it, expect } from "vitest";
import { GraphProvider } from "@/providers/graph/GraphProvider";
import { createDefaultGraph } from "@/lib/graph-utils";
import Graph from "graphology";
import { useGraphContext } from "@/providers/graph/GraphContext";
import userEvent from "@testing-library/user-event";
import { sample } from "@/lib/utils";

function createInitialSolution(algorithm: SupportedAlgorithms) {
  return {
    algorithm,
    meta: { length: 0 },
    highlightedEdges: new Set<string>(),
  };
}

/**
 * Creates a complete graph with 4 nodes and 6 edges
 */
function createGraph() {
  return createDefaultGraph();
}

type Solutions = Parameters<typeof useUpdatedSolutionLengths>[0];
const TestComponent = ({
  solutions,
  graph,
}: {
  solutions: Solutions;
  graph: Graph;
}) => {
  const updatedSolutions = useUpdatedSolutionLengths(solutions, graph);
  const { graphPubSub } = useGraphContext();
  return (
    <div>
      <button onClick={() => graphPubSub.publishGraphUpdated()}>
        update graph
      </button>
      {updatedSolutions.map((solution) => (
        <div key={solution.algorithm}>
          <span data-testid={`length_${solution.algorithm}`}>
            {solution.meta.length}
          </span>
        </div>
      ))}
    </div>
  );
};
function renderTestHook(initialSolution: Solutions, graph: Graph) {
  return render(<TestComponent solutions={initialSolution} graph={graph} />, {
    wrapper: GraphProvider,
  });
}

describe("useUpdatedSolutionLengths", () => {
  it("should use initial solution length on first render", () => {
    const initialSolution = [
      createInitialSolution(SupportedAlgorithms.PRIMS_MST),
    ];
    const screen = renderTestHook(initialSolution, createGraph());
    const mstLength = screen.getByTestId(
      `length_${SupportedAlgorithms.PRIMS_MST}`
    ).textContent;
    expect(mstLength).toEqual("0");
    screen.unmount();
  });

  it("should update solution length when graph is updated or when solution props changes", async () => {
    const user = userEvent.setup();
    const initialSolutions = [
      createInitialSolution(SupportedAlgorithms.PRIMS_MST),
    ];
    const graph = createGraph();
    const edgeIds: string[] = [];
    // Set unit weight for all edges
    graph.forEachEdge((edge) => {
      edgeIds.push(edge);
      graph.updateEdgeAttributes(edge, (attributes) => ({
        ...attributes,
        weight: 1,
        algorithm: [SupportedAlgorithms.PRIMS_MST],
      }));
    });
    const completeGraphWithUnitWeights = graph.copy();
    // pick 4 random edges to highlight
    const highlightedEdges = new Set<string>();
    const maxEdges = 4;
    for (let i = 0; i < maxEdges; i++) {
      highlightedEdges.add(sample(edgeIds));
    }
    initialSolutions[0].highlightedEdges = highlightedEdges;
    initialSolutions[0].meta.length = maxEdges; // each edge is unit length

    /**
     * PART 1
     * - check that the initial solution length is used from the initial solutions prop
     */
    const screen = renderTestHook(initialSolutions, graph);
    const initialMstLength = screen.getByTestId(
      `length_${SupportedAlgorithms.PRIMS_MST}`
    ).textContent;
    expect(initialMstLength).toEqual(maxEdges.toString());

    /**
     * PART 2
     * - remove 2 random edges and check that the length is manually recalculated
     */
    const maxDeletes = 2;
    for (let i = 0; i < maxDeletes; i++) {
      graph.dropEdge([...highlightedEdges][i]);
    }

    const btn = screen.getByText("update graph");
    // trigger graph update
    await user.click(btn);

    const updatedMstLength = screen.getByTestId(
      `length_${SupportedAlgorithms.PRIMS_MST}`
    ).textContent;
    expect(updatedMstLength).not.toEqual(initialMstLength);

    /**
     * PART 3
     * - update the solutions prop with a new graph and ensure
     * that the solution.meta.length value is used instead of a manual recalculation
     */
    screen.rerender(
      <TestComponent
        solutions={[...initialSolutions]}
        graph={completeGraphWithUnitWeights}
      />
    );
    // When updating the solutions prop, the hook should instead
    // return the value of solution.meta.length instead of a manual recalculation
    await waitFor(() => {
      const updatedMstLength2 = screen.getByTestId(
        `length_${SupportedAlgorithms.PRIMS_MST}`
      ).textContent;
      expect(updatedMstLength2).toEqual(initialMstLength);
    });

    screen.unmount();
  });
});
