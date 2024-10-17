import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import './Home.css'

interface HomeProps {
  language: string
}

const Home: React.FC<HomeProps> = ({ language }) => {
  const { t } = useTranslation(language)

  return (
    <div className="home">
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.description')}</p>
      <Link to="/questionnaire" className="cta-button">{t('home.startAnalysis')}</Link>
    </div>
  )
}

export default Home