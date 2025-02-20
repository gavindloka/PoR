// src/components/SettingsModal.tsx
import React, { useState } from 'react';

interface SettingsModalProps {
  initialAgeRange: { min: number; max: number };
  initialRegion: string;
  initialOccupation: string;
  onClose: () => void;
  onSave: (settings: {
    ageRange: { min: number; max: number };
    region: string;
    occupation: string;
  }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  initialAgeRange,
  initialRegion,
  initialOccupation,
  onClose,
  onSave,
}) => {
  const [minAge, setMinAge] = useState(initialAgeRange.min);
  const [maxAge, setMaxAge] = useState(initialAgeRange.max);
  const [region, setRegion] = useState(initialRegion);
  const [occupation, setOccupation] = useState(initialOccupation);

  const handleSave = () => {
    onSave({ ageRange: { min: minAge, max: maxAge }, region, occupation });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
        <h3 className="text-xl font-bold mb-4">Form Settings</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">Age Range:</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(parseInt(e.target.value, 10))}
              placeholder="Min Age"
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(parseInt(e.target.value, 10))}
              placeholder="Max Age"
              className="border p-2 rounded w-1/2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Region:</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Enter region"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Occupation:</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="Enter occupation"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
