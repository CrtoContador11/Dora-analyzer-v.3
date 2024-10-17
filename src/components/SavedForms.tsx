import React, { useState } from 'react';
import { FormData, Question, Category } from '../types';

interface SavedFormsProps {
  formData: FormData[];
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  onUpdateForm: (updatedForm: FormData) => void;
  onDeleteForm: (dateToDelete: string) => void;
}

const SavedForms: React.FC<SavedFormsProps> = ({ formData, questions, categories, language, onUpdateForm, onDeleteForm }) => {
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<Record<number, number>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectForm = (index: number) => {
    setSelectedFormIndex(index);
    setEditedAnswers(formData[index].answers);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setEditedAnswers({ ...editedAnswers, [questionId]: value });
  };

  const handleSaveChanges = () => {
    if (selectedFormIndex !== null) {
      const updatedForm = {
        ...formData[selectedFormIndex],
        answers: editedAnswers,
      };
      onUpdateForm(updatedForm);
      setIsEditing(false);
    }
  };

  const handleDeleteForm = (date: string) => {
    onDeleteForm(date);
    setSelectedFormIndex(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'es' ? 'Cuestionarios guardados' : 'Questionários salvos'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {formData.map((data, index) => (
            <div
              key={index}
              className={`mb-2 p-2 border rounded cursor-pointer text-sm ${
                selectedFormIndex === index ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelectForm(index)}
            >
              <p className="font-semibold">{data.clientName}</p>
              <p className="text-xs text-gray-600">{new Date(data.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}</p>
              <button
                className="mt-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteForm(data.date);
                }}
              >
                {language === 'es' ? 'Eliminar' : 'Excluir'}
              </button>
            </div>
          ))}
        </div>
        <div className="md:col-span-2">
          {selectedFormIndex !== null && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {language === 'es' ? 'Detalles del cuestionario' : 'Detalhes do questionário'}
                </h3>
                <div>
                  <button
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                    onClick={handleEditToggle}
                  >
                    {isEditing
                      ? language === 'es'
                        ? 'Cancelar edición'
                        : 'Cancelar edição'
                      : language === 'es'
                      ? 'Editar respuestas'
                      : 'Editar respostas'}
                  </button>
                  {isEditing && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                      onClick={handleSaveChanges}
                    >
                      {language === 'es' ? 'Guardar cambios' : 'Salvar alterações'}
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm">
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h4 className="text-base font-semibold mb-2">{category.name[language]}</h4>
                    {questions
                      .filter((q) => q.categoryId === category.id)
                      .map((question) => (
                        <div key={question.id} className="mb-2">
                          <p className="font-medium">{question.text[language]}</p>
                          {isEditing ? (
                            <select
                              value={editedAnswers[question.id]}
                              onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                            >
                              {question.options.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.text[language]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-gray-600">
                              {
                                question.options.find(
                                  (option) => option.value === formData[selectedFormIndex].answers[question.id]
                                )?.text[language]
                              }
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedForms;