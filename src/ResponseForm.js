import React, { useState } from "react";

const ResponseForm = () => {
  const [formData, setFormData] = useState({
    assimilationPreference: "",
    missingInfo: "",
    rarePresentationOpinion: "",
    accuracyOpinion: "",
    guidelineComparison: "",
    formatPreference: "",
    usabilityRatings: [
      { accuracy: "", ease: "" },
      { accuracy: "", ease: "" },
      { accuracy: "", ease: "" },
      { accuracy: "", ease: "" },
      { accuracy: "", ease: "" },
    ],
  });

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;

    if (name.startsWith("usability")) {
      const updatedRatings = [...formData.usabilityRatings];
      if (index !== undefined && field) {
        updatedRatings[index][field] = value;
        setFormData({ ...formData, usabilityRatings: updatedRatings });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Replace with API or DB logic
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Clinical Decision Tree Study Response</h1>

      {/* Assimilation Preference */}
      <div>
        <label className="font-semibold block mb-1">
          What is easier to assimilate knowledge from? 20 notes or a summary clinical tree?
        </label>
        <textarea
          name="assimilationPreference"
          value={formData.assimilationPreference}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Missing Info Opinion */}
      <div>
        <label className="font-semibold block mb-1">
          Do you feel you are missing out on some information by not looking at the notes and only looking at the tree?
        </label>
        <textarea
          name="missingInfo"
          value={formData.missingInfo}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Rare Presentation */}
      <div>
        <label className="font-semibold block mb-1">
          Some of the notes have rare disease presentation with unique treatment paths: are notes better to identify that or the tree?
        </label>
        <textarea
          name="rarePresentationOpinion"
          value={formData.rarePresentationOpinion}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Accuracy / Subjective Opinion */}
      <div>
        <label className="font-semibold block mb-1">
          Given a new patient with a current presentation, use the clinical decision tree to diagnose the patient. What's your subjective opinion on this diagnosis?
        </label>
        <textarea
          name="accuracyOpinion"
          value={formData.accuracyOpinion}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Guidelines Comparison */}
      <div>
        <label className="font-semibold block mb-1">
          Application: Compare to guidelines. Why didn’t people stick to guidelines?
        </label>
        <textarea
          name="guidelineComparison"
          value={formData.guidelineComparison}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Format Preference */}
      <div>
        <label className="font-semibold block mb-1">
          You’ll see four tree formats. Which is easiest to incorporate into your workflow?
        </label>
        <textarea
          name="formatPreference"
          value={formData.formatPreference}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Usability Ratings */}
      <div>
        <h2 className="text-lg font-bold mt-4 mb-2">Rate each clinical tree</h2>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="border p-3 rounded mb-2">
            <p className="font-medium">Tree {i + 1}</p>
            <div className="flex space-x-4 mt-1">
              <div>
                <label className="block text-sm">Accuracy of diagnosis (1-5)</label>
                <input
                  type="number"
                  name={`usability-${i}-accuracy`}
                  min="1"
                  max="5"
                  value={formData.usabilityRatings[i].accuracy}
                  onChange={(e) => handleChange(e, i, "accuracy")}
                  className="w-16 border rounded px-1"
                />
              </div>
              <div>
                <label className="block text-sm">Ease of use (1-5)</label>
                <input
                  type="number"
                  name={`usability-${i}-ease`}
                  min="1"
                  max="5"
                  value={formData.usabilityRatings[i].ease}
                  onChange={(e) => handleChange(e, i, "ease")}
                  className="w-16 border rounded px-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default ResponseForm;
