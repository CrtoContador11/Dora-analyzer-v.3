import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import './Questionnaire.css'

interface Question {
  id: number
  text: string
  options: string[]
  category: string
  optionScores: number[]
}

interface QuestionnaireProps {
  language: string
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ language }) => {
  const [clientName, setClientName] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [progress, setProgress] = useState(0)
  const [showQuestions, setShowQuestions] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')
  const { t } = useTranslation(language)

  useEffect(() => {
    console.log('Questionnaire component mounted')
    loadQuestions()
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      const answeredQuestions = Object.keys(answers).length
      setProgress(Math.round((answeredQuestions / questions.length) * 100))
      setShowSubmit(answeredQuestions === questions.length)
    }
  }, [answers, questions])

  const loadQuestions = () => {
    console.log('Loading questions')
    const savedQuestions = JSON.parse(localStorage.getItem('customQuestions') || '[]')
    if (savedQuestions.length > 0) {
      console.log('Loaded custom questions:', savedQuestions)
      setQuestions(savedQuestions)
    } else {
      console.log('No custom questions found, loading default questions')
      const defaultQuestions = [
        {
          id: 1,
          text: "¿En qué medida su entidad ha implementado procesos de gestión de riesgos de TIC?",
          options: ["No implementado", "Parcialmente implementado", "Mayormente implementado", "Totalmente implementado"],
          category: "Gestión de Riesgos",
          optionScores: [25, 50, 75, 100]
        },
        {
          id: 2,
          text: "¿Cómo calificaría la madurez de las políticas de seguridad de TIC en su organización?",
          options: ["Básica", "En desarrollo", "Avanzada", "Líder en la industria"],
          category: "Seguridad de TIC",
          optionScores: [25, 50, 75, 100]
        },
        {
          id: 3,
          text: "¿Cuál es el nivel de preparación de su entidad para gestionar incidentes de TIC?",
          options: ["Bajo", "Medio", "Alto", "Muy alto"],
          category: "Gestión de Incidentes",
          optionScores: [25, 50, 75, 100]
        },
        {
          id: 4,
          text: "¿En qué medida su organización ha implementado planes de continuidad del negocio relacionados con TIC?",
          options: ["No implementado", "Parcialmente implementado", "Mayormente implementado", "Totalmente implementado"],
          category: "Continuidad del Negocio",
          optionScores: [25, 50, 75, 100]
        },
        {
          id: 5,
          text: "¿Con qué frecuencia realiza pruebas de sus sistemas y procesos de TIC?",
          options: ["Raramente", "Anualmente", "Trimestralmente", "Mensualmente o más frecuente"],
          category: "Pruebas",
          optionScores: [25, 50, 75, 100]
        },
      ]
      setQuestions(defaultQuestions)
      localStorage.setItem('customQuestions', JSON.stringify(defaultQuestions))
    }
  }

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({...prev, [questions[currentQuestion].id]: answer}))
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmit = () => {
    const clientData = {
      name: clientName,
      answers: answers,
      user: currentUser
    }
    const savedClients = JSON.parse(localStorage.getItem('savedClients') || '[]')
    const updatedClients = [...savedClients, clientData]
    localStorage.setItem('savedClients', JSON.stringify(updatedClients))
    localStorage.removeItem('questionnaireDraft')
    navigate(`/reports?client=${encodeURIComponent(clientName)}`)
  }

  const handleSaveDraft = () => {
    const draft = {
      clientName: clientName,
      answers: answers,
      currentQuestion: currentQuestion
    }
    localStorage.setItem('questionnaireDraft', JSON.stringify(draft))
    alert(t('questionnaire.draftSaved'))
  }

  const handleStartQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientName.trim() !== '') {
      setShowQuestions(true)
    }
  }

  const handleLoadDraft = () => {
    const draft = JSON.parse(localStorage.getItem('questionnaireDraft') || '{}')
    if (draft.clientName) {
      setClientName(draft.clientName)
      setAnswers(draft.answers || {})
      setCurrentQuestion(draft.currentQuestion || 0)
      setShowQuestions(true)
    } else {
      alert(t('questionnaire.noDraft'))
    }
  }

  if (!showQuestions) {
    return (
      <div className="questionnaire">
        <h2>{t('questionnaire.newQuestionnaire')}</h2>
        <form onSubmit={handleStartQuestionnaire} className="client-name-input">
          <label htmlFor="clientName">{t('questionnaire.clientName')}:</label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <button type="submit" className="start-button">{t('questionnaire.startQuestionnaire')}</button>
        </form>
        <button onClick={handleLoadDraft} className="load-draft-button">{t('questionnaire.loadDraft')}</button>
      </div>
    )
  }

  return (
    <div className="questionnaire">
      <h2>{t('questionnaire.doraImplementationQuestionnaire')}</h2>
      <h3>{t('questionnaire.client')}: {clientName}</h3>
      <div className="progress-bar">
        <div className="progress" style={{width: `${progress}%`}}></div>
      </div>
      <p className="progress-text">{progress}% {t('questionnaire.completed')}</p>
      {currentQuestion < questions.length ? (
        <div className="question">
          <p>{questions[currentQuestion].text}</p>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={`${questions[currentQuestion].id}-${index}`}
              onClick={() => handleAnswer(option)}
              className="answer-button"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <p>{t('questionnaire.allQuestionsCompleted')}</p>
      )}
      <div className="button-group">
        <button onClick={handleSaveDraft} className="save-draft-button">{t('questionnaire.saveDraft')}</button>
        {showSubmit && (
          <button onClick={handleSubmit} className="submit-button">{t('questionnaire.submitAndGenerateReport')}</button>
        )}
      </div>
    </div>
  )
}

export default Questionnaire