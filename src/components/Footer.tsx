import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import './Footer.css'

interface FooterProps {
  language: string
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const { t } = useTranslation(language)

  return (
    <footer className="footer">
      <p>&copy; 2024 DORA Analyzer. {t('footer.rights')}</p>
    </footer>
  )
}

export default Footer