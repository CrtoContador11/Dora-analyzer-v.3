import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Questionnaire from './pages/Questionnaire'
import Reports from './pages/Reports'
import Login from './pages/Login'
import ClientList from './pages/ClientList'
import CustomizeQuestionnaire from './pages/CustomizeQuestionnaire'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      setIsLoggedIn(true)
      setCurrentUser(loggedInUser)
      setIsAdmin(loggedInUser === 'admin')
    }
  }, [])

  const handleLogin = (username: string) => {
    setIsLoggedIn(true)
    setCurrentUser(username)
    setIsAdmin(username === 'admin')
    localStorage.setItem('currentUser', username)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser('')
    setIsAdmin(false)
    localStorage.removeItem('currentUser')
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Header 
            isLoggedIn={isLoggedIn} 
            onLogout={handleLogout} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
            onLanguageChange={handleLanguageChange}
            language={language}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home language={language} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} language={language} />} />
              <Route 
                path="/questionnaire" 
                element={isLoggedIn ? <Questionnaire language={language} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/reports" 
                element={isLoggedIn ? <Reports language={language} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/clients" 
                element={isLoggedIn ? <ClientList language={language} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/customize" 
                element={isLoggedIn && isAdmin ? <CustomizeQuestionnaire language={language} /> : <Navigate to="/" />} 
              />
            </Routes>
          </main>
          <Footer language={language} />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App