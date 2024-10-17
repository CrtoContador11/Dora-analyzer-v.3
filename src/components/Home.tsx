import React from 'react';

interface HomeProps {
  language: 'es' | 'pt';
  onStartQuestionnaire: () => void;
}

const Home: React.FC<HomeProps> = ({ language, onStartQuestionnaire }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-3xl font-bold mb-4">
        {language === 'es' ? 'Bienvenido a DORA Analyzer' : 'Bem-vindo ao DORA Analyzer'}
      </h1>
      <p className="mb-6">
        {language === 'es'
          ? 'DORA Analyzer es una herramienta para evaluar y mejorar sus prácticas de desarrollo y operaciones.'
          : 'DORA Analyzer é uma ferramenta para avaliar e melhorar suas práticas de desenvolvimento e operações.'}
      </p>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p className="font-bold">
          {language === 'es' ? 'Advertencia:' : 'Aviso:'}
        </p>
        <p>
          {language === 'es'
            ? 'Los datos se almacenan en la caché del navegador y se compartirán de forma voluntaria con Ozona Consulting.'
            : 'Os dados são armazenados no cache do navegador e serão compartilhados voluntariamente com a Ozona Consulting.'}
        </p>
      </div>
      <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 mb-6">
        <p className="font-bold">
          {language === 'es' ? 'Descargo de responsabilidad:' : 'Isenção de responsabilidade:'}
        </p>
        <p>
          {language === 'es'
            ? 'El acceso y uso de esta herramienta es voluntario y está limitado a los clientes de Ozona. Esta herramienta se utilizará como medio de recopilación de datos para facilitar las labores de consultoría. Al utilizar esta herramienta, usted acepta estos términos y condiciones.'
            : 'O acesso e uso desta ferramenta é voluntário e limitado aos clientes da Ozona. Esta ferramenta será usada como meio de coleta de dados para facilitar o trabalho de consultoria. Ao usar esta ferramenta, você concorda com estes termos e condições.'}
        </p>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onStartQuestionnaire}
      >
        {language === 'es' ? 'Iniciar Cuestionario' : 'Iniciar Questionário'}
      </button>
    </div>
  );
};

export default Home;