import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const PatientNotesPanel = ({ csvPath = './syn-clinical-notes/reference-patients.csv' }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [viewMode, setViewMode] = useState('aggressive');
  const [selectedNoteSection, setSelectedNoteSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await fetch(csvPath);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setPatients(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV parse error:', error);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Error loading CSV:', err);
        setLoading(false);
      }
    };

    loadPatients();
  }, [csvPath]);

  const selectedPatient = patients[selectedPatientIndex];

  const getNoteSections = () => {
    if (!selectedPatient) return [];
    
    const notesField = viewMode === 'aggressive' 
      ? selectedPatient.Aggressive_Notes 
      : selectedPatient.Conservative_Notes;
    
    if (!notesField) return ["No notes available."];
    
    return notesField.split('---').map(section => section.trim());
  };

  const getSelectedNotes = () => {
    const noteSections = getNoteSections();
    return noteSections[selectedNoteSection] || "No section selected.";
  };

  const getPatientSummary = () => {
    if (!selectedPatient) return null;

    return (
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Patient Information</h3>
        <p><strong>Age:</strong> {selectedPatient.Age}</p>
        <p><strong>Gender:</strong> {selectedPatient.Gender}</p>
        <p><strong>Blood Type:</strong> {selectedPatient["Blood Type"]}</p>
        <p><strong>Occupation:</strong> {selectedPatient["Knowledge Worker"] === "True" ? selectedPatient["Knowledge Worker Profession"] : "Not specified"}</p>
        <p><strong>Tumor:</strong> {selectedPatient.Meningioma_Grade}, {selectedPatient.Tumor_Size}cm, {selectedPatient.Tumor_Location}, volume {selectedPatient.Tumor_Volume}cm³</p>
        <div className="mt-2">
          <h4 className="font-semibold">Symptoms:</h4>
          <p className="text-sm">{selectedPatient.Presenting_Symptoms}</p>
        </div>
        <div className="mt-2">
          <h4 className="font-semibold">Medical History:</h4>
          <p className="text-sm">{selectedPatient.Medical_History}</p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-4">Loading patient data...</div>;

  const noteSections = getNoteSections();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient:</label>
          <select
            value={selectedPatientIndex}
            onChange={(e) => {
              setSelectedPatientIndex(parseInt(e.target.value));
              setSelectedNoteSection(0); // Reset note section when changing patient
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            {patients.map((patient, i) => (
              <option key={i} value={i}>
                {patient.Age}y/o {patient.Gender} - {patient.Meningioma_Grade}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Management Approach:</label>
          <select
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value);
              setSelectedNoteSection(0); // Reset note section when changing view mode
            }}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="aggressive">Aggressive</option>
            <option value="conservative">Conservative</option>
          </select>
        </div>

        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Section:</label>
          <select
            value={selectedNoteSection}
            onChange={(e) => setSelectedNoteSection(parseInt(e.target.value))}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            {noteSections.map((section, i) => (
              <option key={i} value={i}>
                Section {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-shrink-0">
        {getPatientSummary()}
      </div>

      <div className="flex-grow overflow-auto bg-white p-4 rounded shadow whitespace-pre-wrap">
        {getSelectedNotes()}
      </div>
    </div>
  );
};

export default PatientNotesPanel;