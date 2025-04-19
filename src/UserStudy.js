import React, { useState } from "react";
import SVGViewer from "./SVGViewer";
import PatientNotesPanel from "./PatientNotesPanel";
import ResponseForm from "./ResponseForm";

const SequentialClinicalApp = () => {
  // State to track current step (instead of active tab)
  const [currentStep, setCurrentStep] = useState(0);
  
  // State to store data between steps if needed
  const [appData, setAppData] = useState({
    referencePatientData: null,
    testPatientData: null,
    rarePatientData: null,
    userResponses: {}
  });

  // Define the sequence of steps
  const steps = [
    {
      id: 0,
      title: "Reference Clinical Notes",
      task: "Read these clinical notes to help round out your understanding of meningioma management",
      component: <PatientNotesPanel csvPath="./syn-clinical-notes/reference-patients.csv" />
    },
    {
        id: 2,
        title: "Response Form",
        task: "Please Respond to the Form",
        component: <ResponseForm formPath="https://docs.google.com/forms/d/e/1FAIpQLSfglmcTZX3bYgmuMOseBXOppflGqAjt5YfuELwtew82rcMjWA/viewform?usp=header"/>
    },
    {
        id: 1,
        title: "Clinical Decision Trees",
        task: "Study these decision trees to help round out your understanding of meningioma management.\n Using the buttons in the bottom right and left change the format and complexity of the tree.  You can choose between a graphical, text-based, or interactive tree.",
        component: <SVGViewer />
    },
    {
        id: 2,
        title: "Response Form",
        task: "Please Respond to the Form",
        component: <ResponseForm formPath="https://docs.google.com/forms/d/e/1FAIpQLSdMXZLU5-2UsxmkQ89VBiQO4XEOicTjQhFqTrpAEmRlO5_N_A/viewform?usp=sharing"/>
    },
    {
        id: 4,
        title: "Rare Case Comparison",
        task: "Use the partial set of notes and clinical decision trees to suggest treatment and management strategies.",
        component: (
          <div className="flex w-full">
            <div className="w-1/2 p-4 overflow-auto bg-gray-50 border-r">
              <PatientNotesPanel csvPath="./syn-clinical-notes/test-patients.csv" isTesting={true} />
            </div>
            <div className="w-1/2 p-4 overflow-auto bg-gray-50">
              <SVGViewer />
            </div>
          </div>
        )
    },
    {
      id: 5,
      title: "Response Form",
      task: "Please Respond to the Form",
      component: <ResponseForm  formPath="https://docs.google.com/forms/d/e/1FAIpQLSfgQYwV5Vsl8OmiBxq_ffXk7bw0nE87Yfs0PQerouZrLtUREQ/viewform?usp=dialog"/>
    },
    {
        id: 6,
        title: "Clinical Decision Trees",
        task: "Take a final look at the CDTs and the level of detail. Try to notice the trade-offs.",
        component: <SVGViewer />
    },
    {
        id: 7,
        title: "Response Form",
        task: "Please Respond to the Form",
        component: <ResponseForm formPath="https://docs.google.com/forms/d/e/1FAIpQLSflftxFb-9O_o-RuG2xYJiOtSUjfAClv5cB0-j3qBfBNkfyfg/viewform?usp=dialog"/>
    },
  ];

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col h-screen">
      {/* Header with progress indicator */}
      <div className="flex-shrink-0 bg-gray-100 border-b border-gray-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <div className="text-xl font-semibold">
                Task: {steps[currentStep].task}
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-grow overflow-auto">
        {steps[currentStep].component}
      </div>

      {/* Navigation footer */}
      <div className="flex-shrink-0 bg-gray-100 border-t border-gray-300 p-4 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={goToNextStep}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 2 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default SequentialClinicalApp;