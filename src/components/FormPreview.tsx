import type React from 'react';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Question } from './FormBuilder';
import { ChevronDown } from 'lucide-react';

interface FormPreviewProps {
  title: string;
  description: string;
  questions: Question[];
}

export default function FormPreview({
  title,
  description,
  questions,
}: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (questionId: string, value: any) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
    console.log('Updated formData:', formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  useEffect(() => {
    console.log('Questions updated:', questions);
  }, [questions]);

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Form Submitted</CardTitle>
          <CardDescription className="text-center">
            Thank you for your response!
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={() => setSubmitted(false)}>
            Submit another response
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      </Card>

      {questions.map((question) => (
        <Card key={question.id} className="mb-4">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">
                {question.title}
                {question.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            </div>

            {question.type === 'short-answer' && (
              <Input
                placeholder="Your answer"
                className="max-w-md"
                value={formData[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                required={question.required}
              />
            )}

            {question.type === 'paragraph' && (
              <Textarea
                placeholder="Your answer"
                className="max-w-md"
                value={formData[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                required={question.required}
              />
            )}

            {question.type === 'multiple-choice' && question.options && (
              <RadioGroup
                value={formData[question.id] || ''}
                onValueChange={(value) => handleInputChange(question.id, value)}
                required={question.required}
                className="space-y-2"
              >
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.id}
                      id={`${question.id}-${option.id}`}
                      className="w-5 h-5 border border-gray-300 rounded-full bg-white flex items-center justify-center data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    >
                      <div className="w-2.5 h-2.5 bg-white rounded-full hidden data-[state=checked]:block" />
                    </RadioGroupItem>
                    <Label htmlFor={`${question.id}-${option.id}`}>
                      {option.value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'checkboxes' && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}-${option.id}`}
                      checked={formData[question.id]?.includes(option.id)}
                      onCheckedChange={(checked) => {
                        const currentValues = formData[question.id] || [];
                        const newValues = checked
                          ? [...currentValues, option.id]
                          : currentValues.filter(
                            (id: string) => id !== option.id,
                          );
                        handleInputChange(question.id, newValues);
                      }}
                      className="w-5 h-5 border border-gray-300 rounded-md bg-white data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-white hidden data-[state=checked]:block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Checkbox>
                    <Label htmlFor={`${question.id}-${option.id}`}>
                      {option.value}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'dropdown' && question.options && (
              <Select
                value={formData[question.id] || ''}
                onValueChange={(value) => {
                  console.log(`Selected value for ${question.id}:`, value); // Debugging log
                  handleInputChange(question.id, value);
                }}
                required={question.required}
              >
                {/* Select Button (Trigger) with the Selected Value */}
                <SelectTrigger
                  className="w-full max-w-md flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-hidden={false}
                >
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>

                {/* Dropdown Menu */}
                <SelectContent className="w-full max-w-md mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                  {question.options.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={option.id}
                      className="px-4 py-2 text-gray-700 transition cursor-pointer hover:bg-purple-100 hover:text-purple-700 focus:bg-purple-100 focus:text-purple-700"
                    >
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Submit
        </Button>
        <Button type="button" variant="outline" onClick={() => setFormData({})}>
          Clear form
        </Button>
      </div>
    </form>
  );
}
