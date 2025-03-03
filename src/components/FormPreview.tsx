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
import { Form } from '@/declarations/backend/backend.did';
import { LocalForm } from './FormBuilder';

export default function FormPreview({
  metadata,
  questions,
}: LocalForm) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (index: number, value: any) => {
    setFormData({
      ...formData,
      [index]: value,
    });
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
          <CardTitle className="text-2xl">{metadata.title}</CardTitle>
          {metadata.description && <CardDescription>{metadata.description}</CardDescription>}
        </CardHeader>
      </Card>

      {questions.map((question, index) => (
        <Card key={`${question.questionTitle}-${index}`} className="mb-4">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">
                {question.questionTitle}
                {question.isRequired && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            </div>

            {"Essay" in question.questionType && (
              <Textarea
                placeholder="Your answer"
                className="max-w-md"
                value={formData[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required={question.isRequired}
              />
            )}

            {"MultipleChoice" in question.questionType && (
              <RadioGroup
                value={formData[index] || ''}
                onValueChange={(value) => handleInputChange(index, value)}
                required={question.isRequired}
                className="space-y-2"
              >
                {question.questionType.MultipleChoice.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={`${idx}`}
                      id={`${index}-${idx}`}
                      className="w-5 h-5 border border-gray-300 rounded-full bg-white flex items-center justify-center data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    >
                      <div className="w-2.5 h-2.5 bg-white rounded-full hidden data-[state=checked]:block" />
                    </RadioGroupItem>
                    <Label htmlFor={`${index}-${idx}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {"Checkbox" in question.questionType && (
              <div className="space-y-2">
                {question.questionType.Checkbox.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${index}-${idx}`}
                      checked={formData[index]?.includes(idx)}
                      onCheckedChange={(checked) => {
                        const currentValues = formData[index] || [];
                        const newValues = checked
                          ? [...currentValues, idx]
                          : currentValues.filter(
                            (id: string) => parseInt(id) !== idx,
                          );
                        handleInputChange(index, newValues);
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
                    <Label htmlFor={`${index}-${idx}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
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
