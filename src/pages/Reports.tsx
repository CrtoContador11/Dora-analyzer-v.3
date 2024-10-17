import React, { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useTranslation } from '../hooks/useTranslation'
import './Reports.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ReportsProps {
  language: string
}

interface ClientData {
  name: string
  user: string
  answers: { [key: string]: string }
  scores?: number[]
}

const Reports: React.FC<ReportsProps> = ({ language }) => {
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [allClients, setAllClients] = useState<string[]>([])
  const [aggregatedData, setAggregatedData] = useState<ClientData | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const location = useLocation()
  const { t } = useTranslation(language)
  const currentUser = localStorage.getItem('currentUser')

  useEffect(() => {
    // Cargar las categorías al inicio
    const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    setCategories(savedCategories.length > 0 ? savedCategories : ['Gestión de Riesgos', 'Seguridad de TIC', 'Gestión de Incidentes', 'Continuidad del Negocio', 'Pruebas'])
  }, [])

  const calculateScores = useCallback((client: ClientData): number[] => {
    const scores = categories.map(() => 0)
    const categoryCount = categories.map(() => 0)

    const questions = JSON.parse(localStorage.getItem('customQuestions') || '[]')

    Object.entries(client.answers).forEach(([questionId, answer]) => {
      const question = questions.find((q: any) => q.id === parseInt(questionId))
      if (question) {
        const categoryIndex = categories.indexOf(question.category)
        const optionIndex = question.options.indexOf(answer)
        if (categoryIndex !== -1 && optionIndex !== -1) {
          scores[categoryIndex] += question.optionScores[optionIndex]
          categoryCount[categoryIndex]++
        }
      }
    })

    return scores.map((score, index) => 
      categoryCount[index] > 0 ? Math.round(score / categoryCount[index]) : 0
    )
  }, [categories])

  const loadClientData = useCallback((clientName: string) => {
    const savedClients = JSON.parse(localStorage.getItem('savedClients') || '[]') as ClientData[]
    const client = savedClients.find((c) => c.name === clientName && c.user === currentUser)
    if (client) {
      const scores = calculateScores(client)
      setClientData({ ...client, scores })
    }
  }, [currentUser, calculateScores])

  const calculateAggregatedData = useCallback((clients: ClientData[]) => {
    const aggregatedScores = categories.map(() => 0)
    
    clients.forEach(client => {
      const scores = calculateScores(client)
      scores.forEach((score, index) => {
        aggregatedScores[index] += score
      })
    })

    const averageScores = aggregatedScores.map(score => Math.round(score / clients.length))
    setAggregatedData({
      name: 'Todos los clientes',
      user: '',
      answers: {},
      scores: averageScores
    })
  }, [categories, calculateScores])

  const loadAllClients = useCallback(() => {
    const savedClients = JSON.parse(localStorage.getItem('savedClients') || '[]') as ClientData[]
    const userClients = savedClients.filter((client) => client.user === currentUser)
    const uniqueClients = Array.from(new Set(userClients.map((client) => client.name)))
    setAllClients(uniqueClients)
    calculateAggregatedData(userClients)
  }, [currentUser, calculateAggregatedData])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const clientParam = params.get('client')
    if (clientParam) {
      setSelectedClient(clientParam)
      loadClientData(clientParam)
    }
    loadAllClients()
  }, [location, loadClientData, loadAllClients])

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientName = e.target.value
    setSelectedClient(clientName)
    if (clientName === 'all') {
      setClientData(aggregatedData)
    } else {
      loadClientData(clientName)
    }
  }

  const chartData = clientData ? {
    labels: categories,
    datasets: [
      {
        label: clientData.name,
        data: clientData.scores || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  } : null

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('reports.doraImplementationByArea'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: t('reports.implementationLevel'),
        },
      },
      x: {
        title: {
          display: true,
          text: t('reports.categories'),
        },
      },
    },
  }

  return (
    <div className="reports">
      <h2>{t('reports.doraImplementationReport')}</h2>
      <div className="report-controls">
        <select value={selectedClient} onChange={handleClientChange}>
          <option value="">{t('reports.selectClient')}</option>
          <option value="all">{t('reports.allClients')}</option>
          {allClients.map((client, index) => (
            <option key={`${client}-${index}`} value={client}>{client}</option>
          ))}
        </select>
      </div>
      {clientData ? (
        <>
          <h3>{t('reports.client')}: {clientData.name}</h3>
          <div className="chart-container">
            {chartData && <Bar data={chartData} options={options} />}
          </div>
          <div className="summary">
            <h3>{t('reports.executiveSummary')}</h3>
            <p>
              {clientData.name === 'Todos los clientes' 
                ? t('reports.allClientsDescription')
                : t('reports.clientDescription', { clientName: clientData.name })}
              {t('reports.recommendationDescription')}
            </p>
          </div>
        </>
      ) : (
        <p>{t('reports.selectClientToViewReport')}</p>
      )}
    </div>
  )
}

export default Reports