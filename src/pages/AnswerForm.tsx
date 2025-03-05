import { LocalForm } from '@/components/FormBuilder';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Backend, Response_3 } from '@/declarations/backend/backend.did';
import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { Checkbox } from '@radix-ui/react-checkbox';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export default function AnswerForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const { data, loading, error } = useQueryCall<Backend>({
    functionName: 'getForm',
    args: [id ?? ''],
  });
  const form = data as Response_3 | undefined;

  const {
    call,
    data: addResponseData,
    loading: loadingResponse,
  } = useUpdateCall({
    functionName: 'addFormResponse',
    args: [],
    onLoading: (loading) => console.log('Loading:', loading),
    onError: (error) => console.error('Error:', error),
    onSuccess: (data) => console.log('Success:', data),
  });

  const handleInputChange = (index: number, value: any) => {
    setFormData({
      ...formData,
      [index]: value,
    });
  };
  
  useEffect(() => {
    if (form && 'ok' in form) {
      console.log(form.ok);
    }
  }, [form]);

  if (!id) {
    return <div>Form id not found</div>;
  }

  if (!form) {
    return <div>Error</div>;
  }

  if ('err' in form) {
    return <div>{form.err}</div>;
  }

  const currForm = form.ok;
  const questions = currForm.questions;


  return (
    <>
      <div className="max-w-3xl mx-auto pt-10 py-20">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currForm.metadata.title}
            </CardTitle>
            {currForm.metadata.description && (
              <CardDescription>{currForm.metadata.description}</CardDescription>
            )}
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

              {'Essay' in question.questionType && (
                <Textarea
                  placeholder="Your answer"
                  className="w-full"
                  required={question.isRequired}
                />
              )}

              {'Range' in question.questionType && (
                <div className="flex flex-col space-y-2">
                  <Slider
                    min={Number(question.questionType.Range.minRange)}
                    max={Number(question.questionType.Range.maxRange)}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Selected Value:{' '}
                  </span>
                </div>
              )}

              {'MultipleChoice' in question.questionType && (
                <RadioGroup
                  required={question.isRequired}
                  className="space-y-2"
                >
                  {question.questionType.MultipleChoice.options.map(
                    (option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={`${idx}`}
                          id={`${index}-${idx}`}
                          className="w-5 h-5 border border-gray-300 rounded-full bg-white flex items-center justify-center data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        >
                          <div className="w-2.5 h-2.5 bg-white rounded-full hidden data-[state=checked]:block" />
                        </RadioGroupItem>
                        <Label htmlFor={`${index}-${idx}`}>{option}</Label>
                      </div>
                    ),
                  )}
                </RadioGroup>
              )}

              {'Checkbox' in question.questionType && (
                <div className="space-y-2">
                  {question.questionType.Checkbox.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${index}-${idx}`}
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
                      <Label htmlFor={`${index}-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
              
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button className="bg-purple-600 hover:bg-purple-700">Submit</Button>
        </div>
      </div>
    </>
  );
}
