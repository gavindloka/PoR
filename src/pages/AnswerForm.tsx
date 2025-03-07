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
import { AnswerType, Backend, Response_1, Response_4 } from '@/declarations/backend/backend.did';
import { useQueryCall, useUpdateCall } from '@ic-reactor/react';
import { Checkbox } from '@radix-ui/react-checkbox';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function AnswerForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const {
    loading: loadingUser,
    data: rawUser,
    refetch,
  } = useQueryCall<Backend>({
    functionName: 'getUser',
  });

  const user = rawUser as Response_1 | undefined;

  const { data, loading, error } = useQueryCall<Backend>({
    functionName: 'getForm',
    args: [id ?? ''],
  });
  const form = data as Response_4 | undefined;

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    questions.forEach((question, index) => {
      if (question.isRequired && !formData[index]) {
        newErrors[index] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    call: addFormResponseCall,
    data: addResponseData,
    loading: loadingResponse,
    error: responseError,
  } = useUpdateCall<Backend>({
    functionName: 'addFormResponse',
    args: [],
    onLoading: (loading) => console.log('Loading:', loading),
    onError: (error) => {
      console.error('Error:', error);
      toast.error(`Error: ${error}`);
    },
    onSuccess: (data) => {
      console.log('Success:', data);
      toast.success('Form submitted successfully!');
    },
  });

  const handleInputChange = (index: number, value: any) => {
    setFormData({
      ...formData,
      [index]: value,
    });
  };

  const prepareFormSubmission = (): AnswerType[] => {
    const validationErrors: string[] = [];
    return questions.map((question, index) => {
      const value = formData[index];
  
      if ('Essay' in question.questionType) {
        return { 'Essay': value ? [value] : [] };
        
      } 
      else if ('MultipleChoice' in question.questionType) {
        return { 
          'MultipleChoice': value !== undefined ? [BigInt(value)] : [] 
        };
      } 
      else if ('Range' in question.questionType) {
        return { 
          'Range': value !== undefined ? [BigInt(value)] : [] 
        };
      } 
      else if ('Checkbox' in question.questionType) {
        const checkboxes = Array.isArray(value) 
          ? value.map(v => BigInt(v)) 
          : [];
        return { 'Checkbox': checkboxes };
      }
      
      return { 'Essay': [] };
    });
  };

  useEffect(() => {
    if (form && 'ok' in form) {
      console.log(form.ok);
      console.log(new Date(Number(form.ok.metadata.deadline[0]) / 1000));
    }
  }, [form]);

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    // const answers: AnswerType[] = [
    //   { 'Essay': ["halhalao"] },
    //   { 'MultipleChoice': [2n] },
    //   { 'Checkbox': [1n, 3n] },
    //   {'Range':[2n]}
    // ];
  
    if (!validateForm()) {
      toast.error('Please fill all required fields.');
      return;
    }

    const answers = prepareFormSubmission()
    try {
      await addFormResponseCall([
        id ?? '', BigInt(Date.now()) * BigInt(1_000), answers
      ]);
    } catch (error) {
      console.error(error)
    }
  };

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
  // const handleSendICP = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Sending ICPPP', data);
  //   console.log('MEMOOOO', new TextEncoder().encode(currForm.id));
  //   call();
  // };

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
                {errors[index] && (
                <p className="text-red-500 text-sm">This field is required.</p>
              )}
              </div>

              {'Essay' in question.questionType && (
                <Textarea
                  placeholder="Your answer"
                  className="w-full"
                  value={formData[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  required={question.isRequired}
                />
              )}

              {'Range' in question.questionType && (
                <div className="flex flex-col space-y-2">
                  <Slider
                    min={Number(question.questionType.Range.minRange)}
                    max={Number(question.questionType.Range.maxRange)}
                    step={1}
                    onValueChange={(value) =>
                      handleInputChange(index, value[0])
                    }
                    className="w-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Selected Value:{' '}
                    {formData[index] ??
                      Number(question.questionType.Range.minRange)}
                  </span>
                </div>
              )}

              {'MultipleChoice' in question.questionType && (
                <RadioGroup
                  value={formData[index] || ''}
                  onValueChange={(value) => handleInputChange(index, value)}
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
                        onCheckedChange={(checked) => {
                          const currentValues = formData[index] || [];
                          const newValues = checked
                            ? [...currentValues, idx]
                            : currentValues.filter(
                                (id: string) => parseInt(id) !== idx,
                              );
                          handleInputChange(index, newValues);
                        }}
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
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
