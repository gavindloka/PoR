import FormSummaryViewer from '@/components/FormSummaryViewer';
import React from 'react'
import { useParams } from 'react-router'

const FormResponsePage = () => {
    const {id} = useParams();
  return (
    <div className='my-10 max-w-3xl mx-auto'><FormSummaryViewer formId={id || ''} /></div>
  )
}

export default FormResponsePage