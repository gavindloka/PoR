import FormBuilder from '@/components/FormBuilder';
import { Backend, Response_4 } from '@/declarations/backend/backend.did';
import { useQueryCall } from '@ic-reactor/react';
import React from 'react';
import { useParams } from 'react-router';

export const Survey = () => {
  const { id } = useParams();
  const { data, loading, error } = useQueryCall<Backend>({
    functionName: 'getForm',
    args: [id ?? ""]
  });
  const form = data as Response_4 | undefined;

  if (!id) {
    return <div>Form id not found</div>;
  }

  if (!form) {
    return <div>Error</div>
  }

  if ("err" in form) {
    return <div>{form.err}</div>
  }

  return (
    <div className="mt-10">
      <FormBuilder originalForm={form.ok} />
    </div>
  );
};
