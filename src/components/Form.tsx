import React from 'react';
import { FormComponent } from '../formModule';
import { FormDataType, Draft, Question, Category } from '../types';

interface FormProps {
  onSubmit: (data: FormDataType) => void;
  onSaveDraft: (draft: Draft) => void;
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  userName: string;
  providerName: string;
  financialEntityName: string;
  currentDraft: Draft | null;
}

const Form: React.FC<FormProps> = (props) => {
  return <FormComponent {...props} />;
};

export default Form;