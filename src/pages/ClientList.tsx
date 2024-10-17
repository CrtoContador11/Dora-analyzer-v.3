import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import './ClientList.css'

interface ClientListProps {
  language: string
}

const ClientList: React.FC<ClientListProps> = ({ language }) => {
  const [clients, setClients] = useState<any[]>([])
  const currentUser = localStorage.getItem('currentUser')
  const { t } = useTranslation(language)

  const loadClients = useCallback(() => {
    const savedClients = JSON.parse(localStorage.getItem('savedClients') || '[]')
    const userClients = savedClients.filter((client: any) => client.user === currentUser)
    setClients(userClients)
  }, [currentUser])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleDeleteClient = (clientName: string) => {
    const savedClients = JSON.parse(localStorage.getItem('savedClients') || '[]')
    const updatedClients = savedClients.filter((client: any) => !(client.name === clientName && client.user === currentUser))
    localStorage.setItem('savedClients', JSON.stringify(updatedClients))
    loadClients()
  }

  return (
    <div className="client-list">
      <h2>{t('clientList.title')}</h2>
      {clients.length === 0 ? (
        <p>{t('clientList.noClients')}</p>
      ) : (
        <ul>
          {clients.map((client: { name: string }, index: number) => (
            <li key={index}>
              <Link to={`/reports?client=${encodeURIComponent(client.name)}`}>
                {client.name}
              </Link>
              <button onClick={() => handleDeleteClient(client.name)} className="delete-button">
                {t('clientList.delete')}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/questionnaire" className="new-client-button">{t('clientList.newClient')}</Link>
    </div>
  )
}

export default ClientList