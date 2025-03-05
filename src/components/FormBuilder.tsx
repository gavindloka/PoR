import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusCircle, Trash2, Copy, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionField from './QuestionField';
import FormPreview from './FormPreview';
import type {
  Backend,
  Form,
  FormMetadata,
  Question,
  FormResponse,
} from '../declarations/backend/backend.did.d.ts';
import { Principal } from '@ic-reactor/react/dist/types';
import {
  ActorProvider,
  CandidAdapterProvider,
  useUpdateCall,
} from '@ic-reactor/react';
import { toast } from 'sonner';
import { idlFactory } from '@/declarations/icp_ledger_canister';

type Props = {
  originalForm: Form;
};

export type LocalForm = {
  questions: WithId<Question>[];
  id: string;
  creator: Principal;
  responses: Array<FormResponse>;
  metadata: FormMetadata;
  createdAt: bigint;
};

export type WithId<T> = T & { _id: string };

export function giveId<T extends object>(any: T): WithId<T> {
  return { ...any, _id: crypto.randomUUID() };
}

function removeId<T extends { _id: string }>(any: T): Omit<T, '_id'> {
  const { _id, ...rest } = any;
  return rest as Omit<T, '_id'>;
}

function useDebouncedEffect(
  callback: () => void,
  dependencies: any[],
  delay: number = 1000,
) {
  useEffect(() => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler); // Clear timeout if dependencies change before delay
  }, dependencies);
}

export default function FormBuilder({ originalForm }: Props) {
  const form = {
    ...originalForm,
    questions: originalForm.questions.map(giveId),
  };
  const [currentForm, setCurrentForm] = useState(form);
  const [activeTab, setActiveTab] = useState('edit');
  const { call: updateMetadata } = useUpdateCall<Backend>({
    functionName: 'updateFormMetadata',
  });
  const { call: updateQuestions } = useUpdateCall<Backend>({
    functionName: 'setFormQuestions',
  });

  useDebouncedEffect(() => {
    console.log('Called update');
    updateMetadata([currentForm.id, currentForm.metadata])
      .then((response) => {
        if (response && 'err' in response) {
          toast.error(response.err);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
    updateQuestions([
      currentForm.id,
      currentForm.questions.map((question) => removeId(question)),
    ])
      .then((response) => {
        if (response && 'err' in response) {
          toast.error(response.err);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  }, [currentForm]);

  const addQuestion = () => {
    const newQuestion: Question = {
      formId: form.id,
      isRequired: true,
      questionTitle: 'Untitled Question',
      questionType: { Essay: null },
    };
    currentForm.questions.push(giveId(newQuestion));
    setCurrentForm({ ...currentForm });
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = currentForm.questions[index];
    const duplicatedQuestion = giveId({ ...questionToDuplicate });
    currentForm.questions.splice(index + 1, 0, duplicatedQuestion);
    setCurrentForm({ ...currentForm });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...currentForm.questions];
    newQuestions.splice(index, 1);
    setCurrentForm({ ...currentForm, questions: newQuestions });
  };

  const updateQuestion = (index: number, updatedQuestion: WithId<Question>) => {
    const newQuestions = [...currentForm.questions];
    newQuestions[index] = updatedQuestion;
    setCurrentForm({ ...currentForm, questions: newQuestions });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = [...currentForm.questions];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentForm({ ...currentForm, questions: items });
  };

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent
          value="edit"
          className="space-y-4 mt-4 transition-opacity animate-fadeIn"
        >
          <Card>
            <CardContent className="pt-6">
              <Input
                value={currentForm.metadata.title}
                onChange={(e) =>
                  setCurrentForm({
                    ...currentForm,
                    metadata: {
                      ...currentForm.metadata,
                      title: e.currentTarget.value,
                    },
                  })
                }
                className=" font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                style={{ fontSize: '1.5rem' }}
                placeholder="Form Title"
              />
              <Textarea
                value={currentForm.metadata.description}
                onChange={(e) =>
                  setCurrentForm({
                    ...currentForm,
                    metadata: {
                      ...currentForm.metadata,
                      description: e.currentTarget.value,
                    },
                  })
                }
                className="mt-2 border-none resize-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                placeholder="Form Description"
              />
            </CardContent>
          </Card>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {currentForm.questions.map((question, index) => (
                    <Draggable
                      key={`${question._id}`}
                      draggableId={`${question._id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative"
                        >
                          <Card>
                            <CardContent className="pt-6">
                              <div
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-move"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical size={20} />
                              </div>
                              <div className="pl-8">
                                <QuestionField
                                  question={question}
                                  onChange={(updatedQuestion) =>
                                    updateQuestion(index, updatedQuestion)
                                  }
                                />
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => duplicateQuestion(index)}
                                >
                                  <Copy size={18} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeQuestion(index)}
                                  disabled={currentForm.questions.length === 1}
                                >
                                  <Trash2 size={18} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button onClick={addQuestion} variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <CandidAdapterProvider>
            <ActorProvider
              canisterId={'ryjl3-tyaaa-aaaaa-aaaba-cai'}
              idlFactory={idlFactory}
            >
              <FormPreview {...{ currentForm, setCurrentForm }} />
            </ActorProvider>
          </CandidAdapterProvider>
        </TabsContent>

        {/* <Modal {...{ currentForm, setCurrentForm }}></Modal> */}
      </Tabs>
    </div>
  );
}
