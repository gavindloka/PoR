import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Backend,
  FormResponseSummary,
  Response_3,
} from '@/declarations/backend/backend.did';
import { Label } from '@/components/ui/label';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useQueryCall } from '@ic-reactor/react';
import { toast } from 'sonner';

type Props = {
  formId: string;
};

function FormSummaryViewer({ formId }: Props) {
  // const data: Response_3 = {
  //   ok: [
  //     120n,
  //     [
  //       {
  //         question: {
  //           isRequired: true,
  //           questionType: {
  //             MultipleChoice: { options: ['Yes', 'No', 'Maybe'] },
  //           },
  //           questionTitle: 'Do you enjoy using our platform?',
  //           formId: 'form123',
  //         },
  //         summary: { FrequencyArray: [50n, 40n, 30n] },
  //       },
  //       {
  //         question: {
  //           isRequired: true,
  //           questionType: { Essay: null },
  //           questionTitle: 'What improvements would you like to see?',
  //           formId: 'form123',
  //         },
  //         summary: {
  //           Essay: [
  //             'More features',
  //             'Better UI',
  //             'Faster loading',
  //             'Dark mode support',
  //             'Improved mobile experience',
  //             'More customization options',
  //             'Better accessibility features',
  //             'Faster response times',
  //             'Offline mode support',
  //             'More integrations with other apps',
  //             'Better security features',
  //             'More detailed analytics',
  //             'Improved search functionality',
  //             'Easier navigation',
  //             'More user-friendly design',
  //             'Better error messages',
  //             'More frequent updates',
  //             'Personalized recommendations',
  //             'Improved notifications',
  //             'More flexible pricing options',
  //           ],
  //         },
  //       },
  //       {
  //         question: {
  //           isRequired: false,
  //           questionType: { Range: { minRange: 1n, maxRange: 10n } },
  //           questionTitle: 'How satisfied are you with our service? (1-10)',
  //           formId: 'form123',
  //         },
  //         summary: {
  //           FrequencyMap: [
  //             [1n, 5n],
  //             [2n, 10n],
  //             [3n, 15n],
  //             [4n, 20n],
  //             [5n, 25n],
  //             [6n, 10n],
  //             [7n, 5n],
  //             [8n, 10n],
  //             [9n, 15n],
  //             [10n, 5n],
  //           ],
  //         },
  //       },
  //     ],
  //   ],
  // };

  const { data, loading } = useQueryCall<Backend>({
    functionName: 'getFormResponseSummary',
    args: [formId],
  });
  const responseSummaries = data as Response_3 | undefined;

  const mapFrequencyArray = (
    responseSummary: FormResponseSummary,
    count: number,
    i: number,
  ) => {
    if ('MultipleChoice' in responseSummary.question.questionType) {
      return {
        option: responseSummary.question.questionType.MultipleChoice.options[i],
        count: count,
      };
    }
    if ('Checkbox' in responseSummary.question.questionType) {
      return {
        option: responseSummary.question.questionType.Checkbox.options[i],
        count: count,
      };
    }
  };

  if (loading) {
    return <div>Fetching response summary</div>;
  }
  if (!responseSummaries) {
    return <div>Fetching response summary</div>;
  }
  if ('err' in responseSummaries) {
    toast.error(responseSummaries.err);
    return <div>{responseSummaries.err}</div>;
  }

  const responseCount = responseSummaries.ok[0];
  const summaries = responseSummaries.ok[1];

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            {responseCount + ' Responses'}
          </CardTitle>
        </CardHeader>
      </Card>
      {summaries.map((responseSummary, index) => (
        <Card
          key={`${responseSummary.question.questionTitle}-${index}`}
          className="mb-4"
        >
          <CardContent className="p-6">
            <Label className="text-base font-medium">
              {responseSummary.question.questionTitle}
            </Label>
            <div className="mt-5 max-h-96 overflow-scroll rounded-md">
              {'Essay' in responseSummary.summary &&
                responseSummary.summary.Essay.map((text) => (
                  <div className="bg-violet-100 px-4 py-2.5 text-sm rounded-md my-1">
                    {text}
                  </div>
                ))}
            </div>
            {'FrequencyArray' in responseSummary.summary && (
              <ResponsiveContainer
                className="mt-5 px-4"
                width="100%"
                height={300}
              >
                <BarChart
                  data={responseSummary.summary.FrequencyArray.map((count, i) =>
                    mapFrequencyArray(responseSummary, Number(count), i),
                  )}
                >
                  <YAxis />
                  <XAxis dataKey="option" />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 2" />

                  <Bar dataKey="count" fill="#5b21b6" />
                </BarChart>
              </ResponsiveContainer>
            )}
            {'FrequencyMap' in responseSummary.summary && (
              <ResponsiveContainer
                className="mt-5 px-4"
                width="100%"
                height={300}
              >
                <BarChart
                  data={responseSummary.summary.FrequencyMap.map((entry) => ({
                    option: Number(entry[0]),
                    count: Number(entry[1]),
                  }))}
                >
                  <YAxis />
                  <XAxis dataKey="option" />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 2" />

                  <Bar dataKey="count" fill="#5b21b6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default FormSummaryViewer;
