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
import { Question } from '@/declarations/backend/backend.did';
import { WithId } from './FormBuilder';

interface QuestionFieldProps {
  question: WithId<Question>;
  onChange: (question: WithId<Question>) => void;
}

export default function QuestionField({
  question,
  onChange,
}: QuestionFieldProps) {
  const handleTypeChange = (questionTypeName: string) => {
    const updatedQuestion = { ...question };

    if (questionTypeName === "MultipleChoice") {
      updatedQuestion.questionType = {
        "MultipleChoice": {
          options: [
            'Option 1', 'Option 2'
          ]
        }
      };
    }
    else if (questionTypeName === "Checkbox") {
      updatedQuestion.questionType = {
        "Checkbox": {
          options: [
            'Option 1', 'Option 2'
          ]
        }
      };
    }
    else if (questionTypeName === "Essay") {
      updatedQuestion.questionType = {
        "Essay": null,
      };
    }
    else if (questionTypeName === "Range") {
      updatedQuestion.questionType = {
        "Range": {
          minRange: BigInt(1),
          maxRange: BigInt(10),
        }
      };
    }

    onChange(updatedQuestion);
  };

  const handleTitleChange = (questionTitle: string) => {
    onChange({ ...question, questionTitle });
  };

  const handleRequiredChange = (isRequired: boolean) => {
    onChange({ ...question, isRequired });
  };

  const addOption = () => {
    const updatedQuestion = { ...question };

    if ("MultipleChoice" in updatedQuestion.questionType) {
      updatedQuestion.questionType.MultipleChoice.options.push("New Option");
    }
    else if ("Checkbox" in updatedQuestion.questionType) {
      updatedQuestion.questionType.Checkbox.options.push("New Option");
    }

    onChange(updatedQuestion);
  };

  const updateOption = (index: number, value: string) => {
    const updatedQuestion = { ...question };

    if ("MultipleChoice" in updatedQuestion.questionType) {
      updatedQuestion.questionType.MultipleChoice.options[index] = value;
    }
    else if ("Checkbox" in updatedQuestion.questionType) {
      updatedQuestion.questionType.Checkbox.options[index] = value;
    }

    onChange(updatedQuestion);
  };

  const removeOption = (index: number) => {
    const updatedQuestion = { ...question };

    if ("MultipleChoice" in updatedQuestion.questionType) {
      updatedQuestion.questionType.MultipleChoice.options.splice(index, 1);
    }
    else if ("Checkbox" in updatedQuestion.questionType) {
      updatedQuestion.questionType.Checkbox.options.splice(index, 1);
    }

    onChange(updatedQuestion);
  };

  const questionOptions = "MultipleChoice" in question.questionType ? question.questionType.MultipleChoice.options
    : "Checkbox" in question.questionType ? question.questionType.Checkbox.options : null;
  const isMultipleChoice = "MultipleChoice" in question.questionType;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          value={question.questionTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Question"
          className="flex-1"
        />
        <Select value={Object.keys(question.questionType)[0]} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essay">Essay</SelectItem>
            <SelectItem value="MultipleChoice">Multiple choice</SelectItem>
            <SelectItem value="Checkbox">Checkboxes</SelectItem>
            <SelectItem value="Range">Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {"Essay" in question.questionType && (
        <Textarea
          disabled
          placeholder="Long answer text"
          className="max-w-md bg-muted/50"
        />
      )}

      {(questionOptions) && (
        <div className="space-y-2">
          {questionOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-6 flex justify-center">
                {isMultipleChoice ? (
                  <div className="w-4 h-4 rounded-full border border-primary" />
                ) : (
                  <div className="w-4 h-4 rounded border border-primary" />
                )}
              </div>
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                disabled={!questionOptions || questionOptions.length <= 2}
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
          id={`required-${question.questionTitle}`}
          checked={question.isRequired}
          onCheckedChange={handleRequiredChange}
          className="w-12 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-purple-500 transition"
        >
          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transform translate-x-1 transition data-[state=checked]:translate-x-6" />
        </Switch.Root>
        <Label htmlFor={`required-${question.questionTitle}`}>Required</Label>
      </div>
    </div>
  );
}
