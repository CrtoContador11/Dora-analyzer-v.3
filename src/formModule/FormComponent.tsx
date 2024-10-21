import React, { useState, useEffect, useRef } from 'react';
import { Question, Category, FormDataType, Draft } from '../types';
import ProgressBar from '../components/ProgressBar';
import { generateAndSendPDF } from '../telegramPDF/generateAndSendPDF';
import { Bar } from 'react-chartjs-2';
import { generateChartData, chartOptions } from '../utils/chartUtils';

interface FormComponentProps {
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

const FormComponent: React.FC<FormComponentProps> = ({
  onSubmit,
  onSaveDraft,
  questions,
  categories,
  language,
  userName,
  providerName,
  financialEntityName,
  currentDraft
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [observations, setObservations] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (currentDraft) {
      setAnswers(currentDraft.answers);
      setObservations(currentDraft.observations);
      setCurrentQuestionIndex(currentDraft.lastQuestionIndex);
    }
  }, [currentDraft]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (answers[currentQuestion?.id] !== undefined ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleObservation = (value: string) => {
    setObservations({ ...observations, [currentQuestion.id]: value });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData: FormDataType = {
      providerName,
      financialEntityName,
      userName,
      answers,
      observations,
      date: new Date().toISOString(),
    };

    console.log("Submitting form data:", formData);

    try {
      const chartImage = chartRef.current?.toBase64Image();
      const telegramSent = await generateAndSendPDF(formData, questions, categories, language, chartImage);
      if (telegramSent) {
        console.log("PDF sent to Telegram successfully");
        onSubmit(formData);
      } else {
        throw new Error("Failed to send PDF to Telegram");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrorMessage(language === 'es' 
        ? 'Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo.' 
        : 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const draft: Draft = {
      providerName,
      financialEntityName,
      userName,
      answers,
      observations,
      date: new Date().toISOString(),
      lastQuestionIndex: currentQuestionIndex,
      isCompleted: false,
    };
    onSaveDraft(draft);
  };

  const replaceVariables = (text: string) => {
    return text
      .replace('{providerName}', providerName)
      .replace('{financialEntityName}', financialEntityName);
  };

  if (!currentQuestion) {
    return <div>No hay preguntas disponibles.</div>;
  }

  const chartData = generateChartData({ providerName, financialEntityName, userName, answers, observations, date: new Date().toISOString() }, questions, categories, language);

  return (
    <div className="bg-white shadow-lg rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
        {language === 'es' ? 'Cuestionario DORA' : 'Questionário DORA'}
      </h2>
      <ProgressBar progress={progress} />
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          {replaceVariables(currentQuestion.text[language])}
        </h3>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 mb-2 rounded transition-colors duration-200 text-sm sm:text-base ${
              answers[currentQuestion.id] === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => handleAnswer(option.value)}
          >
            {option.text[language]}
          </button>
        ))}
        <textarea
          className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
          placeholder={language === 'es' ? 'Observaciones (opcional)' : 'Observações (opcional)'}
          value={observations[currentQuestion.id] || ''}
          onChange={(e) => handleObservation(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Bar ref={chartRef} data={chartData} options={chartOptions(language)} />
      </div>
      <div className="flex justify-between">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          {language === 'es' ? 'Anterior' : 'Anterior'}
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (language === 'es' ? 'Enviando...' : 'Enviando...') 
              : (language === 'es' ? 'Enviar' : 'Enviar')}
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm sm:text-base"
            onClick={handleSaveDraft}
          >
            {language === 'es' ? 'Guardar borrador' : 'Salvar rascunho'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormComponent;