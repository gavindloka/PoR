import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusCircle, Trash2, Copy, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import QuestionField from './QuestionField';
import FormPreview from './FormPreview';

export type QuestionType =
  | 'short-answer'
  | 'paragraph'
  | 'multiple-choice'
  | 'checkboxes'
  | 'dropdown';

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Option[];
}

export default function FormBuilder() {
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      type: 'short-answer',
      title: 'What is your name?',
      required: true,
    },
  ]);
  const [activeTab, setActiveTab] = useState('edit');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      type: 'short-answer',
      title: 'Untitled Question',
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: `q${questions.length + 1}`,
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="relative flex w-full bg-purple-600 p-1 rounded-lg text-white">
          <TabsTrigger
            value="edit"
            className="relative flex-1 px-4 py-2 text-center font-medium transition-all 
                 data-[state=active]:bg-white data-[state=active]:text-purple-600 
                 data-[state=active]:rounded-lg hover:bg-purple-500 hover:bg-opacity-30"
          >
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="relative flex-1 px-4 py-2 text-center font-medium transition-all 
                 data-[state=active]:bg-white data-[state=active]:text-purple-600 
                 data-[state=active]:rounded-lg hover:bg-purple-500 hover:bg-opacity-30"
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="edit"
          className="space-y-4 mt-4 transition-opacity animate-fadeIn"
        >
          <Card>
            <CardContent className="pt-6">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className=" font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                style={{ fontSize: '1.5rem' }}
                placeholder="Form Title"
              />
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="mt-2 border-none resize-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  {questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
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
                                  disabled={questions.length === 1}
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
          <FormPreview
            title={formTitle}
            description={formDescription}
            questions={questions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
