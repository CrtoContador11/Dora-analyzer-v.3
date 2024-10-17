import React, { useState, useEffect } from 'react';
import { Question, Category, FormData, Draft } from '../types';
import ProgressBar from './ProgressBar';

interface FormProps {
  onSubmit: (data: FormData) => void;
  onSaveDraft: (draft: Draft) => void;
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  userName: string;
  setUserName: (name: string) => void;
  currentDraft: Draft | null;
}

const Form: React.FC<FormProps> = ({ onSubmit, onSaveDraft, questions, categories, language, userName, setUserName, currentDraft }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [clientName, setClientName] = useState('');
  const [localUserName, setLocalUserName] = useState(userName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentDraft) {
      setAnswers(currentDraft.answers);
      setClientName(currentDraft.clientName);
      setLocalUserName(currentDraft.userName);
      setCurrentQuestionIndex(currentDraft.lastQuestionIndex);
    }
  }, [currentDraft]);

  if (questions.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'es' ? 'No hay preguntas disponibles' : 'Não há perguntas disponíveis'}
        </h2>
        <p>
          {language === 'es'
            ? 'Por favor, contacte al administrador para agregar preguntas al cuestionario.'
            : 'Por favor, entre em contato com o administrador para adicionar perguntas ao questionário.'}
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestionIndex >= 0 
    ? ((currentQuestionIndex + (answers[currentQuestion?.id] !== undefined ? 1 : 0)) / questions.length) * 100 
    : 0;

  const handleStartQuestionnaire = () => {
    if (!clientName.trim() || !localUserName.trim()) {
      setError(language === 'es' 
        ? 'Por favor, complete el nombre del cliente y el nombre de usuario.' 
        : 'Por favor, preencha o nome do cliente e o nome de usuário.');
      return;
    }
    setError('');
    setUserName(localUserName);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentQuestionIndex(-1);
    }
  };

  const handleSubmit = () => {
    const formData: FormData = {
      clientName,
      userName: localUserName,
      answers,
      date: currentDraft ? currentDraft.date : new Date().toISOString(),
    };
    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    const draft: Draft = {
      clientName,
      userName: localUserName,
      answers,
      date: currentDraft ? currentDraft.date : new Date().toISOString(),
      lastQuestionIndex: currentQuestionIndex,
      isCompleted: false,
    };
    onSaveDraft(draft);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isLastQuestionAnswered = isLastQuestion && answers[currentQuestion?.id] !== undefined;

  return (
    <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'es' ? 'Cuestionario DORA' : 'Questionário DORA'}
      </h2>
      {currentQuestionIndex >= 0 && <ProgressBar progress={progress} />}
      {currentQuestionIndex === -1 ? (
        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientName">
              {language === 'es' ? 'Nombre del cliente' : 'Nome do cliente'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese el nombre del cliente' : 'Digite o nome do cliente'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
              {language === 'es' ? 'Nombre de usuario' : 'Nome de usuário'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="userName"
              type="text"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              placeholder={language === 'es' ? 'Ingrese su nombre de usuario' : 'Digite seu nome de usuário'}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleStartQuestionnaire}
          >
            {language === 'es' ? 'Comenzar cuestionario' : 'Iniciar questionário'}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{currentQuestion.text[language]}</h3>
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
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handlePrevious}
            >
              {language === 'es' ? 'Anterior' : 'Anterior'}
            </button>
            {isLastQuestionAnswered ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
              >
                {language === 'es' ? 'Enviar' : 'Enviar'}
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
        </>
      )}
    </div>
  );
};

export default Form;