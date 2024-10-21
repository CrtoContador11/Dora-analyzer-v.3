import React, { useState, useEffect, useRef } from 'react';
import { Question, Category, FormDataType, Draft } from '../types';
import ProgressBar from '../components/ProgressBar';
import { generateAndSendPDF } from '../telegramPDF/generateAndSendPDF';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const chartRef = useRef<ChartJS>(null);

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

  const generateChartData = () => {
    return {
      labels: categories.map((category) => category.name[language]),
      datasets: [
        {
          label: language === 'es' ? 'Puntuación' : 'Pontuação',
          data: categories.map((category) => {
            const categoryQuestions = questions.filter((q) => q.categoryId === category.id);
            const categoryScores = categoryQuestions.map((q) => answers[q.id] || 0);
            return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: language === 'es' ? 'Puntuación por categoría' : 'Pontuação por categoria',
      },
    },
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
      if (chartRef.current) {
        const chartImage = chartRef.current.toBase64Image();
        const telegramSent = await generateAndSendPDF(formData, questions, categories, language, chartImage);
        if (telegramSent) {
          console.log("PDF sent to Telegram successfully");
        } else {
          console.error("Failed to send PDF to Telegram");
        }
      } else {
        console.warn("Chart reference is not available");
      }

      onSubmit(formData);
    } catch (error) {
      console.error("Error during form submission:", error);
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

  return (
    <div className="bg-white shadow-lg rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        {language === 'es' ? 'Cuestionario DORA' : 'Questionário DORA'}
      </h2>
      <ProgressBar progress={progress} />
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          {replaceVariables(currentQuestion.text[language])}
        </h3>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 mb-2 rounded transition-colors duration-200 ${
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
          className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={language === 'es' ? 'Observaciones (opcional)' : 'Observações (opcional)'}
          value={observations[currentQuestion.id] || ''}
          onChange={(e) => handleObservation(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          {language === 'es' ? 'Anterior' : 'Anterior'}
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (language === 'es' ? 'Enviando...' : 'Enviando...') 
              : (language === 'es' ? 'Enviar' : 'Enviar')}
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSaveDraft}
          >
            {language === 'es' ? 'Guardar borrador' : 'Salvar rascunho'}
          </button>
        )}
      </div>
      <div className="mt-8">
        <Bar ref={chartRef} data={generateChartData()} options={chartOptions} />
      </div>
    </div>
  );
};

export default FormComponent;