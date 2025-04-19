import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const PatientNotesPanel = ({ 
  csvPath = './syn-clinical-notes/reference-patients.csv', 
  rarePath ="./syn-clinical-notes/rare-patients.csv", 
  isTesting=false 
}) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [viewMode, setViewMode] = useState('aggressive');
  const [selectedNoteSection, setSelectedNoteSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const [csvResponse, rareResponse] = await Promise.all([
          fetch(csvPath),
          fetch(rarePath)
        ]);
  
        const [csvText, rareText] = await Promise.all([
          csvResponse.text(),
          rareResponse.text()
        ]);
  
        const parseCSV = (text) =>
          new Promise((resolve, reject) => {
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => resolve(results.data),
              error: (error) => reject(error)
            });
          });
  
        const [regularPatients, rarePatients] = await Promise.all([
          parseCSV(csvText),
          parseCSV(rareText)
        ]);

        if (isTesting) {
          // Pick 2 regular + 1 rare
          const regularSpliced = regularPatients.slice(22, 24);
          const rareSpliced = rarePatients.slice(4, 5);
          var selected = [...regularSpliced, ...rareSpliced];

          // Trim notes to first 3 sections
          selected = selected.map((patient) => {
            const trimNotes = (noteField) => {
              if (typeof noteField !== 'string') return '';
              const sections = noteField
                .split('---')
                .map(s => s.trim())
                .filter(s => s); // Remove empty sections
              return sections.slice(0, 3).join('---');
            };
            return {
              ...patient,
              Aggressive_Notes: trimNotes(patient.Aggressive_Notes),
              Conservative_Notes: trimNotes(patient.Conservative_Notes),
            };
          });

          setPatients(selected);
        } else {
          const selectedRarePatients = rarePatients.slice(0, 2);
          const shuffled = regularPatients.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 18);

          const combined = [...selectedRarePatients, ...selected].sort(() => 0.5 - Math.random());
    
          setPatients(combined);
        }
      } catch (err) {
        console.error('Error loading CSVs:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadPatients();
  }, [csvPath, rarePath]);

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