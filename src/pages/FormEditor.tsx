// src/components/FormEditor.tsx
import QuestionEditor, {
  Question,
  QuestionType,
} from '@/components/QuestionEditor';
import SettingsModal from '@/components/SettingModal';
import React, { useState } from 'react';

const FormEditor: React.FC = () => {
  const [title, setTitle] = useState('Untitled');
  const [editingTitle, setEditingTitle] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextId, setNextId] = useState(1);
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [formSettings, setFormSettings] = useState({
    ageRange: { min: 18, max: 65 },
    region: '',
    occupation: '',
  });
  const [showSettings, setShowSettings] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: nextId,
      text: '',
      type,
    };
    setQuestions([...questions, newQuestion]);
    setNextId(nextId + 1);
    setShowAddMenu(false);
  };

  const updateQuestion = (id: number, updatedFields: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updatedFields } : q)),
    );
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const exportFormData = () => {
    const formData = { title, questions, settings: formSettings };
    const text = JSON.stringify(formData, null, 2);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-secondary">
      <div className="container mx-auto p-4 w-full">
        <div className="flex justify-between">
          {editingTitle ? (
            <input
              className="text-2xl font-bold text-primary bg-secondary mb-4 border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              autoFocus
            />
          ) : (
            <h2
              className="text-2xl font-bold mb-4 cursor-pointer"
              onClick={() => setEditingTitle(true)}
            >
              {title}
            </h2>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 mr-2"
          >
            Settings
          </button>
        </div>
        <div className="w-full ">
          {questions.map((question) => (
            <QuestionEditor
              key={question.id}
              question={question}
              onChange={updateQuestion}
              onRemove={removeQuestion}
            />
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Add Question
          </button>
          {showAddMenu && (
            <div className="absolute mt-2 flex space-x-2 p-2 bg-white border rounded shadow z-10">
              <button
                onClick={() => addQuestion('essay')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Essay
              </button>
              <button
                onClick={() => addQuestion('section-title')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Section Title
              </button>
              <button
                onClick={() => addQuestion('multiple-choice')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Multiple Choice
              </button>
              <button
                onClick={() => addQuestion('checkbox')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Checkbox
              </button>
              <button
                onClick={() => addQuestion('range')}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Range
              </button>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={exportFormData}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Export to TXT
          </button>
        </div>
      </div>
      {showSettings && (
        <SettingsModal
          initialAgeRange={formSettings.ageRange}
          initialRegion={formSettings.region}
          initialOccupation={formSettings.occupation}
          onClose={() => setShowSettings(false)}
          onSave={(settings) => setFormSettings(settings)}
        />
      )}
    </div>
  );
};

export default FormEditor;
