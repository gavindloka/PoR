// src/components/QuestionEditor.tsx
import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';

export type QuestionType =
  | 'section-title'
  | 'range'
  | 'multiple-choice'
  | 'checkbox'
  | 'essay';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  // For range questions
  min?: number;
  max?: number;
  // For multiple-choice and checkbox questions
  options?: string[];
}

interface QuestionEditorProps {
  question: Question;
  onChange: (id: number, updatedFields: Partial<Question>) => void;
  onRemove: (id: number) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onRemove,
}) => {
  return (
    <div className="border p-4 mb-4 rounded shadow flex w-full bg-white">
      <div className="w-3/4">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={question.text}
            onChange={(e) => onChange(question.id, { text: e.target.value })}
            placeholder={
              question.type === 'section-title'
                ? 'Enter section title'
                : 'Enter your question'
            }
            className={`border p-2 text-white rounded w-full ${
              question.type === 'section-title' ? 'text-xl font-bold' : ''
            }`}
          />
        </div>

        {question.type === 'range' && (
          <div className="mt-2 flex space-x-2">
            <input
              type="number"
              value={question.min ?? 1}
              onChange={(e) =>
                onChange(question.id, { min: parseInt(e.target.value, 10) })
              }
              placeholder="Min"
              className="border p-2 text-white rounded w-20"
              min={0}
            />
            <input
              type="number"
              value={question.max ?? 5}
              onChange={(e) =>
                onChange(question.id, { max: parseInt(e.target.value, 10) })
              }
              placeholder="Max"
              className="border p-2 text-white rounded w-20"
            />
          </div>
        )}

        {(question.type === 'multiple-choice' ||
          question.type === 'checkbox') && (
          <div className="mt-2">
            <h3 className="font-semibold mb-1">Options:</h3>
            {(question.options || []).map((option, index) => (
              <div key={index} className="flex items-center mt-1">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = question.options
                      ? [...question.options]
                      : [];
                    newOptions[index] = e.target.value;
                    onChange(question.id, { options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="border text-white  p-2 rounded flex-grow"
                />
                <button
                  onClick={() => {
                    const newOptions = (question.options || []).filter(
                      (_, i) => i !== index,
                    );
                    onChange(question.id, { options: newOptions });
                  }}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = question.options
                  ? [...question.options, '']
                  : [''];
                onChange(question.id, { options: newOptions });
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>
        )}
      </div>
      <div className="">
        <QuestionTypeSelector
          currentType={question.type}
          onSelect={(newType) => onChange(question.id, { type: newType })}
        />
      </div>
      <button
        onClick={() => onRemove(question.id)}
        className="ml-4 text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
};

export default QuestionEditor;
