import React, { useState } from "react";
import SVGViewer from "./SVGViewer";
import PatientNotesPanel from "./PatientNotesPanel";
import ResponseForm from "./ResponseForm";

const SimpleNotesWithSVG = () => {
  const [activeTab, setActiveTab] = useState("A");

  const renderTabContent = () => {
    switch (activeTab) {
        case "A":
                return <SVGViewer />;
        case "B":
                return <PatientNotesPanel csvPath="./syn-clinical-notes/reference-patients.csv" />;
        case "C":
                return (<>
                {/* Left panel */}
                <div className="w-1/2 p-4 overflow-auto bg-gray-50 border-r">
                        <PatientNotesPanel csvPath="./syn-clinical-notes/test-patients.csv" />
                </div>
                {/* Right panel */}
                <div className="w-1/2 p-4 overflow-auto bg-gray-50">
                        <SVGViewer />
                </div>
                </>);
        case "D":
                return (<>
                {/* Left panel */}
                <div className="w-1/2 p-4 overflow-auto bg-gray-50 border-r">
                        <PatientNotesPanel csvPath="./syn-clinical-notes/test-patients.csv" />
                </div>
                {/* Right panel */}
                <div className="w-1/2 p-4 overflow-auto bg-gray-50">
                        <SVGViewer />
                </div>
                </>);
        case "E":
                return <ResponseForm />;
        default:
                return <SVGViewer />;
        }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-gray-100 border-b border-gray-300 p-2">
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
        <button
          className={`px-4 py-2 rounded-t-lg ml-2 ${
            activeTab === "C"
              ? "bg-white font-semibold border-t border-l border-r"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("C")}
        >
          Standard Case Comparison
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ml-2 ${
            activeTab === "D"
              ? "bg-white font-semibold border-t border-l border-r"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("D")}
        >
          Rare Compare Comparison
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ml-2 ${
            activeTab === "E"
              ? "bg-white font-semibold border-t border-l border-r"
              : "text-gray-500 hover:text-black"
          }`}
          onClick={() => setActiveTab("E")}
        >
          Response Form
        </button>
      </div>
      

      {/* Split Content Area */}
      <div className="flex flex-grow">
          {renderTabContent()}
      </div>
    </div>
  );
};

export default SimpleNotesWithSVG;