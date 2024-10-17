import { useCallback } from 'react'
import es from '../translations/es.json'
import pt from '../translations/pt.json'

const translations: { [key: string]: any } = { es, pt }

export const useTranslation = (language: string) => {
  const t = useCallback((key: string, params?: { [key: string]: string | number }) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation key "${key}" not found for language "${language}"`)
        return key
      }
      value = value[k]
    }
    if (params) {
      return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
        value
      )
    }
    return value
  }, [language])

  return { t }
}