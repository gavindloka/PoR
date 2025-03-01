import { PlusCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from 'radix-ui';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Question, QuestionType, Option } from './FormBuilder';

interface QuestionFieldProps {
  question: Question;
  onChange: (question: Question) => void;
}

export default function QuestionField({
  question,
  onChange,
}: QuestionFieldProps) {
  const handleTypeChange = (type: QuestionType) => {
    const updatedQuestion = { ...question, type };

    if (
      (type === 'multiple-choice' ||
        type === 'checkboxes' ||
        type === 'dropdown') &&
      !question.options
    ) {
      updatedQuestion.options = [
        { id: 'option1', value: 'Option 1' },
        { id: 'option2', value: 'Option 2' },
      ];
    }

    onChange(updatedQuestion);
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...question, title });
  };

  const handleRequiredChange = (required: boolean) => {
    onChange({ ...question, required });
  };

  const addOption = () => {
    if (!question.options) return;

    const newOption: Option = {
      id: `option${question.options.length + 1}`,
      value: `Option ${question.options.length + 1}`,
    };

    onChange({
      ...question,
      options: [...question.options, newOption],
    });
  };

  const updateOption = (index: number, value: string) => {
    if (!question.options) return;

    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], value };

    onChange({
      ...question,
      options: newOptions,
    });
  };

  const removeOption = (index: number) => {
    if (!question.options || question.options.length <= 2) return;

    const newOptions = [...question.options];
    newOptions.splice(index, 1);

    onChange({
      ...question,
      options: newOptions,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          value={question.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Question"
          className="flex-1"
        />
        <Select value={question.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short-answer">Short answer</SelectItem>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="multiple-choice">Multiple choice</SelectItem>
            <SelectItem value="checkboxes">Checkboxes</SelectItem>
            <SelectItem value="dropdown">Dropdown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {question.type === 'short-answer' && (
        <Input
          disabled
          placeholder="Short answer text"
          className="max-w-md bg-muted/50"
        />
      )}

      {question.type === 'paragraph' && (
        <Textarea
          disabled
          placeholder="Long answer text"
          className="max-w-md bg-muted/50"
        />
      )}

      {(question.type === 'multiple-choice' ||
        question.type === 'checkboxes' ||
        question.type === 'dropdown') && (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="w-6 flex justify-center">
                  {question.type === 'multiple-choice' && (
                    <div className="w-4 h-4 rounded-full border border-primary" />
                  )}
                  {question.type === 'checkboxes' && (
                    <div className="w-4 h-4 rounded border border-primary" />
                  )}
                  {question.type === 'dropdown' && (
                    <span className="text-sm text-muted-foreground">
                      {index + 1}.
                    </span>
                  )}
                </div>
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  disabled={!question.options || question.options.length <= 2}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-8"
              onClick={addOption}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add option
            </Button>
          </div>
        )}

      <div className="flex items-center space-x-2">
        <Switch.Root
          id={`required-${question.id}`}
          checked={question.required}
          onCheckedChange={handleRequiredChange}
          className="w-12 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-purple-500 transition"
        >
          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transform translate-x-1 transition data-[state=checked]:translate-x-6" />
        </Switch.Root>
        <Label htmlFor={`required-${question.id}`}>Required</Label>
      </div>
    </div>
  );
}
