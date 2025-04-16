import React, { useState } from "react";
import PatientNotesPanel from './PatientNotesPanel';
import SVGViewer from './SVGViewer';

const ReferencePanel = () => {
  const [activeTab, setActiveTab] = useState("A");

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div>
        <button
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === "A"
              ? "bg-white font-semibold border-t border-l border-r"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("A")}
        >
          Clinical Decision Trees
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ml-2 ${
            activeTab === "B"
              ? "bg-white font-semibold border-t border-l border-r"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("B")}
        >
          Clinical Notes
        </button>
      </div>

      {/* Content */}
      {activeTab === "A" ?  <SVGViewer /> : <PatientNotesPanel csvPath="./syn-clinical-notes/reference-patients.csv"/>}
      
    </div>
  );
};

export default ReferencePanel;
