import React, { useState, useRef } from 'react';
import { FormDataType, Question, Category } from '../types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { generatePDF } from '../pdfGenerator/generatePDF';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SavedFormsProps {
  formData: FormDataType[];
  questions: Question[];
  categories: Category[];
  language: 'es' | 'pt';
  onUpdateForm: (updatedForm: FormDataType) => void;
  onDeleteForm: (dateToDelete: string) => void;
}

const SavedForms: React.FC<SavedFormsProps> = ({ formData, questions, categories, language, onUpdateForm, onDeleteForm }) => {
  const [selectedFormIndex, setSelectedFormIndex] = useState<number | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<Record<number, number>>({});
  const [editedObservations, setEditedObservations] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const chartRef = useRef<ChartJS>(null);

  const handleSelectForm = (index: number) => {
    setSelectedFormIndex(index);
    setEditedAnswers(formData[index].answers);
    setEditedObservations(formData[index].observations);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setEditedAnswers({ ...editedAnswers, [questionId]: value });
  };

  const handleObservationChange = (questionId: number, value: string) => {
    setEditedObservations({ ...editedObservations, [questionId]: value });
  };

  const handleSaveChanges = () => {
    if (selectedFormIndex !== null) {
      const updatedForm = {
        ...formData[selectedFormIndex],
        answers: editedAnswers,
        observations: editedObservations,
      };
      onUpdateForm(updatedForm);
      setIsEditing(false);
    }
  };

  const handleGeneratePDF = () => {
    if (selectedFormIndex !== null && chartRef.current) {
      const chartImage = chartRef.current.toBase64Image();
      const doc = generatePDF(formData[selectedFormIndex], questions, categories, language, chartImage);
      doc.save('informe_dora.pdf');
    }
  };

  // ... (rest of the component logic)

  return (
    <div className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'es' ? 'Cuestionarios guardados' : 'Questionários salvos'}
      </h2>
      {/* ... (rest of the JSX) */}
      {selectedFormIndex !== null && (
        <button
          className="m-1 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={handleGeneratePDF}
        >
          {language === 'es' ? 'Generar PDF' : 'Gerar PDF'}
        </button>
      )}
    </div>
  );
};

export default SavedForms;