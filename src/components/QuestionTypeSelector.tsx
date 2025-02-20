// src/components/QuestionTypeDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';

export type QuestionType =
  | 'section-title'
  | 'range'
  | 'multiple-choice'
  | 'checkbox'
  | 'essay';

interface Option {
  value: QuestionType;
  label: string;
  icon: JSX.Element;
}

const options: Option[] = [
  {
    value: 'section-title',
    label: 'Section Title',
    icon: (
      // Simple heading icon
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16"
        />
      </svg>
    ),
  },
  {
    value: 'essay',
    label: 'Essay',
    icon: (
      // Simple text lines icon
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16h8M8 12h8M8 8h8"
        />
      </svg>
    ),
  },
  {
    value: 'multiple-choice',
    label: 'Multiple Choice',
    icon: (
      // Simple list icon
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
  },
  {
    value: 'checkbox',
    label: 'Checkbox',
    icon: (
      // Simple checkmark icon
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  {
    value: 'range',
    label: 'Range',
    icon: (
      // Simple horizontal line icon for a slider
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 12h16"
        />
      </svg>
    ),
  },
];

interface QuestionTypeDropdownProps {
  currentType: QuestionType;
  onSelect: (type: QuestionType) => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeDropdownProps> = ({
  currentType,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find((option) => option.value === currentType);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 border border-primary rounded w-48 bg-white flex items-center"
      >
        {currentOption?.icon}
        {currentOption?.label}
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-48 bg-white border rounded shadow z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className="w-full border text-left px-3 py-2 hover:bg-gray-100 flex items-center"
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionTypeSelector;
