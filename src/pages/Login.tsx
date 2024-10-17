import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import './Login.css'

interface LoginProps {
  onLogin: (username: string) => void
  language: string
}

const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation(language)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((username === 'dora' && password === 'dora2024') || 
        (username === 'daniel' && password === 'pruebadora') ||
        (username === 'admin' && password === 'admin')) {
      onLogin(username)
      localStorage.setItem('currentUser', username)
      navigate('/questionnaire')
    } else {
      setError(t('login.error'))
    }
  }

  return (
    <div className="login">
      <h2>{t('login.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">{t('login.username')}:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">{t('login.password')}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">{t('login.submit')}</button>
      </form>
    </div>
  )
}

export default Login