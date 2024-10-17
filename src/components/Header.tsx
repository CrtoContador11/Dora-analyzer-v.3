import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import './Header.css'

interface HeaderProps {
  isLoggedIn: boolean
  onLogout: () => void
  currentUser: string
  isAdmin: boolean
  onLanguageChange: (lang: string) => void
  language: string
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, currentUser, isAdmin, onLanguageChange, language }) => {
  const { t } = useTranslation(language)

  return (
    <header className="header">
      <div className="logo">DORA Analyzer</div>
      <nav>
        <ul>
          <li><Link to="/">{t('header.home')}</Link></li>
          {isLoggedIn && (
            <>
              <li><Link to="/questionnaire">{t('header.questionnaire')}</Link></li>
              <li><Link to="/reports">{t('header.reports')}</Link></li>
              <li><Link to="/clients">{t('header.clients')}</Link></li>
              {isAdmin && <li><Link to="/customize">{t('header.customize')}</Link></li>}
              <li><span className="user-info">{t('header.user')}: {currentUser}</span></li>
              <li><button onClick={onLogout} className="logout-button">{t('header.logout')}</button></li>
            </>
          )}
          {!isLoggedIn && (
            <li><Link to="/login">{t('header.login')}</Link></li>
          )}
        </ul>
      </nav>
      <div className="language-buttons">
        <button onClick={() => onLanguageChange('es')} className="language-button">
          <img src="https://flagcdn.com/w20/es.png" alt="Español" title="Español" />
        </button>
        <button onClick={() => onLanguageChange('pt')} className="language-button">
          <img src="https://flagcdn.com/w20/pt.png" alt="Português" title="Português" />
        </button>
      </div>
    </header>
  )
}

export default Header