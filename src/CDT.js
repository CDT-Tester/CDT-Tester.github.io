import React, { useEffect, useState } from 'react';

function parseDecisionGraph(raw) {
  const lines = raw.split("\n").map(line => line.trim()).filter(Boolean);
  const graph = {};

  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("##") && line.endsWith("##")) {
      currentSection = line.replace(/##/g, "").trim();
      graph[currentSection] = { label: currentSection, options: [] };
    } else if (line.includes("->")) {
      const parts = line.split("->").map(part => part.trim());
      const fromNode = parts[0];
      const isCurrentSection = fromNode === currentSection;
      const condition = parts.slice(1, -1).join(" -> ");
      const nextNode = parts[parts.length - 1];

      // If this line belongs to a section, store it there
      if (isCurrentSection) {
        graph[currentSection].options.push({ condition, next: nextNode });
      } else {
        // Otherwise, treat it as a standalone node (could happen near END OF GRAPH)
        if (!graph[fromNode]) {
          graph[fromNode] = { label: fromNode, options: [] };
        }
        graph[fromNode].options.push({ condition, next: nextNode });
      }
    }
  }

  // Add a terminal END node
  graph["END OF GRAPH"] = { label: "END OF GRAPH", options: [] };

  return graph;
}

const DecisionNavigator = ({ treePath = './txt-cdts/Text_Complex_2_Tree.txt'}) => {
  const [path, setPath] = useState(["Suspected Meningioma"]);
  const[decisionData, setDecisionData] = useState({})

  useEffect(() => {
    const loadDecisions = async () => {
      try {
        const response = await fetch(treePath);
        const treeText = await response.text();
        setDecisionData(parseDecisionGraph(treeText));
        if (treePath === './txt-cdts/Text_Complex_2_Tree.txt'){
          setPath(["Meningioma Detected"]);
        } else {
          setPath(["Suspected Meningioma"]);
        }

      } catch (err) {
        console.error('Error loading CSV:', err);
      }
    };

    loadDecisions();
  }, [treePath]);

  const currentNodeKey = path[path.length - 1];
  const currentNode = decisionData[currentNodeKey];

  if (!decisionData || !decisionData[currentNodeKey]) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
        <h1 className="text-xl font-bold mb-4">Decision Navigator</h1>
        <p>Loading decision graph or invalid node...</p>
      </div>
    );
  }

  const handleSelect = (next) => {
    setPath([...path, next]);
  };

  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">Decision Navigator</h1>
      <p className="mb-4 font-medium">Current Step: {currentNode.label}</p>
      <ul className="space-y-2">
        {currentNode.options.map((opt, index) => (
          <li key={index}>
            <button
              className="w-full text-left bg-blue-100 hover:bg-blue-200 p-3 rounded"
              onClick={() => handleSelect(opt.next)}
            >
              {opt.condition} ➡️ <strong>{opt.next}</strong>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between">
        <button onClick={handleBack} className="text-sm text-gray-600 underline">⬅️ Go Back</button>
        <span className="text-sm text-gray-500">Path: {path.join(" → ")}</span>
      </div>
    </div>
  );
};

export default DecisionNavigator;
