import React from 'react';
import { Draft } from '../types';

interface DraftsProps {
  drafts: Draft[];
  language: 'es' | 'pt';
  onContinueDraft: (draft: Draft) => void;
  onDeleteDraft: (date: string) => void;
}

const Drafts: React.FC<DraftsProps> = ({ drafts, language, onContinueDraft, onDeleteDraft }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'es' ? 'Borradores' : 'Rascunhos'}
      </h2>
      {drafts.map((draft, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <p>
            <strong>{language === 'es' ? 'Cliente' : 'Cliente'}:</strong> {draft.clientName}
          </p>
          <p>
            <strong>{language === 'es' ? 'Usuario' : 'Usuário'}:</strong> {draft.userName}
          </p>
          <p>
            <strong>{language === 'es' ? 'Fecha' : 'Data'}:</strong>{' '}
            {new Date(draft.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'pt-BR')}
          </p>
          <p>
            <strong>{language === 'es' ? 'Estado' : 'Estado'}:</strong>{' '}
            {draft.isCompleted 
              ? (language === 'es' ? 'Finalizado' : 'Finalizado')
              : (language === 'es' ? 'En progreso' : 'Em andamento')}
          </p>
          <div className="mt-2 flex space-x-2">
            {!draft.isCompleted && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => onContinueDraft(draft)}
              >
                {language === 'es' ? 'Continuar' : 'Continuar'}
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => onDeleteDraft(draft.date)}
            >
              {language === 'es' ? 'Eliminar' : 'Excluir'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Drafts;