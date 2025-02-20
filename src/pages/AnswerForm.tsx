// src/pages/InteractiveFormPage.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface QuestionData {
  id: number;
  text: string;
  type: string;
  min?: number;
  max?: number;
  options?: string[];
}

interface FormData {
  title: string;
  questions: QuestionData[];
}

const AnswerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState('');
  // answers is an object with keys as question ids and values as the answer(s)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const parsed: FormData = JSON.parse(result);
        setFormData(parsed);
        setError('');
      } catch (err) {
        setError(
          'Failed to parse file. Make sure it is a valid exported form file.',
        );
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Submitted Answers:', answers);
    alert('Form submitted! Check the console for answers.');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interactive Form</h2>
      {!formData && (
        <div className="mb-4">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="mb-2"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}

      {formData && (
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold mb-4">{formData.title}</h3>
          {formData.questions.map((q) => {
            // Render section titles as headers
            if (q.type === 'section-title') {
              return (
                <h4 key={q.id} className="text-lg font-bold mt-6 mb-2">
                  {q.text}
                </h4>
              );
            }
            return (
              <div key={q.id} className="mb-4">
                <label className="block font-medium mb-1">{q.text}</label>
                {q.type === 'essay' && (
                  <textarea
                    className="border p-2 w-full rounded"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                  />
                )}
                {q.type === 'multiple-choice' && q.options && (
                  <div>
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-1">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={() => handleInputChange(q.id, option)}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                {q.type === 'checkbox' && q.options && (
                  <div>
                    {q.options.map((option, index) => {
                      const selected: string[] = answers[q.id] || [];
                      return (
                        <div key={index} className="flex items-center mb-1">
                          <input
                            type="checkbox"
                            name={`question-${q.id}`}
                            value={option}
                            checked={selected.includes(option)}
                            onChange={(e) => {
                              let newSelected = [...selected];
                              if (e.target.checked) {
                                newSelected.push(option);
                              } else {
                                newSelected = newSelected.filter(
                                  (item) => item !== option,
                                );
                              }
                              handleInputChange(q.id, newSelected);
                            }}
                            className="mr-2"
                          />
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {q.type === 'range' && (
                  <div>
                    <input
                      type="range"
                      min={q.min ?? 1}
                      max={q.max ?? 5}
                      value={answers[q.id] || q.min || 1}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">
                      Value: {answers[q.id] || q.min || 1}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Form
          </button>
        </form>
      )}
    </div>
  );
};

export default AnswerForm;
