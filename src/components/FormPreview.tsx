import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as MainForm,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@radix-ui/react-checkbox';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FormMetadata } from '@/declarations/backend/backend.did.d.ts';
import { icp_ledger_canister } from '@/declarations/icp_ledger_canister';
import { cn } from '@/lib/utils';
import { Principal as DFinityPrincipal } from '@dfinity/principal';
import {
  useQueryCall,
  useUpdateCall,
  useUserPrincipal,
} from '@ic-reactor/react';
import { format } from 'date-fns';
import { LocalForm } from './FormBuilder';
import { Calendar } from './ui/calendar';
import { CountryDropdown } from './ui/country-dropdown';
import { OccupationDropdown } from './ui/occupation-dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { Slider } from './ui/slider';
import { backend } from '@/declarations/backend';
import { toast } from 'sonner';
import { CategoryDropdown } from './ui/category-dropdown';
import { useNavigate } from 'react-router';

export type ICPLedger = typeof icp_ledger_canister;

export type Backend = typeof backend;

export default function FormPreview({
  currentForm,
  callPublish,
}: {
  currentForm: LocalForm;
  callPublish: (newMetadata: FormMetadata) => void;
}) {
  const navigate = useNavigate();
  const questions = currentForm.questions;
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPublishModalOpen, setPublishModalOpen] = useState(false);
  // we save this locally to prevent rerenders from changing state passed down from a parent component
  const [localMetadata, setLocalMetadata] = useState<FormMetadata>({
    ...currentForm.metadata,
  });
  const handleInputChange = (index: number, value: any) => {
    setFormData({
      ...formData,
      [index]: value,
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setPublishModalOpen(true);
  };

  function hashMemo(str: String) {
    let hash = 0n;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31n + BigInt(str.charCodeAt(i))) % 2n ** 64n; // Keep within 64-bit
    }
    return new Uint8Array(new BigUint64Array([hash]).buffer);
  }

  const principal = useUserPrincipal() as DFinityPrincipal;
  const { call, data, error } = useQueryCall<ICPLedger, 'icrc2_transfer_from'>({
    functionName: 'icrc2_transfer_from',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    args: [
      {
        from: {
          owner: principal,
          subaccount: [],
        },
        to: {
          owner: DFinityPrincipal.fromText('be2us-64aaa-aaaaa-qaabq-cai'),
          subaccount: [],
        },
        amount: BigInt(localMetadata.maxRewardPool / BigInt(2)),
        fee: [],
        spender_subaccount: [],
        memo: [hashMemo(currentForm.id)],
        created_at_time: [],
      },
    ],
  });
  console.log(localMetadata);

  const handleSendICP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await call();
      if (!response) {
        toast.error('Unknown error occurred');
        return;
      }
      if ('err' in response) {
        toast.error(response.err as string);
        return;
      }
      console.log('ICP successfully sent');
      callPublish(localMetadata);
      toast.success('Survey Form Published');
    } catch (error) {
      console.error(error);
    }
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' }),
    age: z
      .string()
      .min(1, { message: 'Age is required' })
      .refine((val) => !isNaN(Number.parseInt(val)), {
        message: 'Age must be a number',
      }),
    gender: z.string().min(1, { message: 'Gender is required' }),
    city: z.string().min(2, { message: 'City must be at least 2 characters' }),
    country: z.string().min(1, { message: 'Country is required' }),
    occupation: z.string().min(1, { message: 'Occupation is required' }),
    categories: z.string().min(1, { message: 'Category is required' }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      city: '',
      country: '',
      occupation: '',
      categories: '',
    },
  });

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
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{localMetadata.title}</CardTitle>
          {localMetadata.description && (
            <CardDescription>{localMetadata.description}</CardDescription>
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
                value={formData[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required={question.isRequired}
              />
            )}
            {'Range' in question.questionType && (
              <div className="flex flex-col space-y-2">
                <Slider
                  value={[
                    formData[index] ??
                      Number(question.questionType.Range.minRange),
                  ]}
                  min={Number(question.questionType.Range.minRange)}
                  max={Number(question.questionType.Range.maxRange)}
                  step={1}
                  onValueChange={(value) => handleInputChange(index, value[0])}
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
                    <Label htmlFor={`${index}-${idx}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {!localMetadata.published && (
        <div className="flex justify-between">
          <Button
            onClick={handlePublish}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Publish
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({})}
          >
            Clear form
          </Button>
        </div>
      )}

      {/* Modal */}

      <Dialog open={isPublishModalOpen} onOpenChange={setPublishModalOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <Tabs className="w-full" defaultValue="requirements">
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">
                  Form Details
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground mt-1">
                Configure your form requirements and set up rewards for
                respondents.
              </DialogDescription>
              <TabsList className="p-5">
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <Separator className="mt-4" />
            </DialogHeader>

            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <TabsContent value="requirements" className="mt-0 space-y-6">
                <MainForm {...form}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Time Settings
                              </CardTitle>
                              <CardDescription>
                                Set the deadline for form submissions
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="deadline">
                                    Deadline{' '}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-[340px] justify-start text-left font-normal',
                                          !localMetadata.deadline[0] &&
                                            'text-muted-foreground',
                                        )}
                                      >
                                        <CalendarIcon />
                                        {localMetadata.deadline[0] ? (
                                          format(
                                            new Date(
                                              Number(
                                                localMetadata.deadline[0],
                                              ) / 1000,
                                            ),
                                            'PPP',
                                          )
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={
                                          localMetadata.deadline[0]
                                            ? new Date(
                                                Number(
                                                  localMetadata.deadline[0],
                                                ) / 1000,
                                              )
                                            : undefined
                                        }
                                        onSelect={(date) => {
                                          if (date) {
                                            const input =
                                              date?.getTime() * 1000;

                                            localMetadata.deadline = [
                                              BigInt(input),
                                            ];
                                          } else {
                                            localMetadata.deadline = [];
                                          }
                                          setLocalMetadata({
                                            ...localMetadata,
                                          });
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Category Settings
                              </CardTitle>
                              <CardDescription>
                                Set the category of your survey
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <CategoryDropdown
                                value={localMetadata.categories[0]?.toString()}
                                onChange={(categories) => {
                                  const input = categories.id;
                                  currentForm;
                                  localMetadata.categories = [input];
                                  setLocalMetadata({ ...localMetadata });
                                }}
                              />
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Age Requirements
                              </CardTitle>
                              <CardDescription>
                                Define age range for respondents
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="min-age">
                                      Minimum Age [Optional]
                                    </Label>
                                    <Input
                                      id="min-age"
                                      placeholder="ex. At least 20 y.o "
                                      className="mt-1"
                                      type="number"
                                      value={localMetadata.minAge[0]?.toString()}
                                      onChange={(e) => {
                                        const input = BigInt(e.target.value);
                                        localMetadata.minAge = [input];
                                        setLocalMetadata({ ...localMetadata });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="max-age">
                                      Maximum Age [Optional]
                                    </Label>
                                    <Input
                                      id="max-age"
                                      placeholder="ex. Maximum 40 y.o "
                                      className="mt-1"
                                      type="number"
                                      value={localMetadata.maxAge[0]?.toString()}
                                      onChange={(e) => {
                                        const input = BigInt(e.target.value);
                                        localMetadata.maxAge = [input];
                                        setLocalMetadata({ ...localMetadata });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormControl>
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                Location & Occupation
                              </CardTitle>
                              <CardDescription>
                                Set location and occupation requirements
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label
                                      htmlFor="country"
                                      className="block mb-1"
                                    >
                                      Country [Optional]
                                    </Label>
                                    <FormControl>
                                      <CountryDropdown
                                        placeholder="Select your country"
                                        value={localMetadata.country[0]?.toString()}
                                        onChange={(country) => {
                                          const input = country.alpha3;
                                          localMetadata.country = [input];
                                          setLocalMetadata({
                                            ...localMetadata,
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor="city"
                                      className="block mb-1"
                                    >
                                      City [Optional]
                                    </Label>
                                    <Input
                                      id="city"
                                      placeholder="Enter city"
                                      value={localMetadata.city[0]?.toString()}
                                      onChange={(e) => {
                                        const input = e.target.value;
                                        localMetadata.city = [input];
                                        setLocalMetadata({ ...localMetadata });
                                      }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label
                                    htmlFor="occupation"
                                    className="block mb-1"
                                  >
                                    Occupation [Optional]
                                  </Label>
                                  <FormControl>
                                    <OccupationDropdown
                                      value={localMetadata.occupation[0]?.toString()}
                                      onChange={(occupation) => {
                                        const input = occupation.id;
                                        currentForm;
                                        localMetadata.occupation = [input];
                                        setLocalMetadata({ ...localMetadata });
                                      }}
                                    />
                                  </FormControl>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </MainForm>
              </TabsContent>

              <TabsContent value="rewards" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reward Settings</CardTitle>
                    <CardDescription>
                      Configure ICP rewards for respondents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="reward-amount">
                          Reward Amount (ICP)
                        </Label>
                        <Input
                          id="reward-amount"
                          type="number"
                          placeholder="0.01"
                          className="mt-1"
                          value={(
                            Number(localMetadata.rewardAmount) / 100_000_000
                          ).toString()}
                          min={0.01}
                          onChange={(e) => {
                            let input =
                              parseFloat(e.target.value) * 100_000_000;

                            if (isNaN(input)) {
                              input = 0;
                            }

                            if (input < 1_000_000) {
                              input = 1_000_000;
                            }

                            localMetadata.rewardAmount = BigInt(
                              Math.round(input),
                            );
                            setLocalMetadata({ ...localMetadata });
                            if (localMetadata.rewardAmount > 0) {
                              const maxRespondents = BigInt(
                                localMetadata.maxRewardPool /
                                  localMetadata.rewardAmount,
                              );

                              localMetadata.maxRespondent = maxRespondents;
                              setLocalMetadata({ ...localMetadata });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-pool">
                          Total Reward Pool (ICP)
                        </Label>
                        <Input
                          id="reward-pool"
                          type="number"
                          placeholder="0.1"
                          className="mt-1"
                          value={(
                            Number(localMetadata.maxRewardPool) / 100_000_000
                          ).toString()}
                          min={currentForm.questions.length * 0.1}
                          step={0.1}
                          onChange={(e) => {
                            let input =
                              parseFloat(e.target.value) * 100_000_000;

                            if (input < 1_000_000) {
                              input = 1_000_000;
                            }

                            localMetadata.maxRewardPool = BigInt(
                              Math.round(input),
                            );
                            setLocalMetadata({ ...localMetadata });
                            if (localMetadata.rewardAmount > 0) {
                              const maxRespondents = BigInt(
                                localMetadata.maxRewardPool /
                                  localMetadata.rewardAmount,
                              );

                              localMetadata.maxRespondent = maxRespondents;
                              setLocalMetadata({ ...localMetadata });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-respondents">
                          Maximum Respondents
                        </Label>
                        <Input
                          disabled
                          id="max-respondents"
                          type="number"
                          placeholder="1000"
                          className="mt-1"
                          value={Number(localMetadata.maxRespondent)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => setPublishModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendICP}>Publish Form</Button>{' '}
            </DialogFooter>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
