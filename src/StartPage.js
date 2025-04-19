import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router

const StartPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // For navigation after starting

  // Function to handle starting the sequence
  const handleStart = () => {
    setIsLoading(true);
    // Simulate loading resources (remove this in production)
    setTimeout(() => {
      setIsLoading(false);
      navigate("/study"); // Navigate to your sequence component
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-blue-800">Clinical Decision Trees User Study</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to the Clinical Decision Tree User Study
              </h2>
              <p className="text-gray-600">
                A step-by-step study to help assess the pros and cons of LLM-driven Clinical Decision Trees using fictional and synthetic clinical notes
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">About This Tool</h3>
                <p className="text-gray-700">
                  This application will guide you through a sequential process to analyze patient 
                  data, compare cases, and recommend appropriate clinical decisions based on 
                  established traditional clinical notes and decision trees.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">What to Expect:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Read Clinical Notes</h4>
                      <p className="text-sm text-gray-600">Review clinical notes and understand treatment decisions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Read Clinical Decision Trees</h4>
                      <p className="text-sm text-gray-600">Study Different Forms of Clinical Decision Trees</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                      3
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800">CDT Case Comparison</h4>
                        <p className="text-sm text-gray-600">Use CDTs to help guide your clinical decisions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">CDT Comparison</h4>
                      <p className="text-sm text-gray-600">Given only the CDTs, study if they are accurate and understandble</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Begin User Study"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Cale Gregory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StartPage;