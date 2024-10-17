import React, { useState, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import './CustomizeQuestionnaire.css'

interface Question {
  id: number
  text: string
  options: string[]
  category: string
  optionScores: number[]
}

interface CustomizeQuestionnaireProps {
  language: string
}

const CustomizeQuestionnaire: React.FC<CustomizeQuestionnaireProps> = ({ language }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 0,
    text: '',
    options: [''],
    category: '',
    optionScores: [0]
  })
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<{ old: string; new: string } | null>(null)
  const { t } = useTranslation(language)

  useEffect(() => {
    loadQuestionsAndCategories()
  }, [])

  const loadQuestionsAndCategories = () => {
    const savedQuestions = JSON.parse(localStorage.getItem('customQuestions') || '[]')
    setQuestions(savedQuestions)

    const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    setCategories(savedCategories.length > 0 ? savedCategories : ['Gestión de Riesgos', 'Seguridad de TIC', 'Gestión de Incidentes', 'Continuidad del Negocio', 'Pruebas'])
  }

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      localStorage.setItem('categories', JSON.stringify(updatedCategories))
      setNewCategory('')
    }
  }

  const handleDeleteCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category)
    setCategories(updatedCategories)
    localStorage.setItem('categories', JSON.stringify(updatedCategories))

    const updatedQuestions = questions.map(q => ({
      ...q,
      category: q.category === category ? '' : q.category
    }))
    setQuestions(updatedQuestions)
    localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions))
  }

  const handleUpdateCategory = () => {
    if (editingCategory) {
      const updatedCategories = categories.map(c => 
        c === editingCategory.old ? editingCategory.new : c
      )
      setCategories(updatedCategories)
      localStorage.setItem('categories', JSON.stringify(updatedCategories))

      const updatedQuestions = questions.map(q => ({
        ...q,
        category: q.category === editingCategory.old ? editingCategory.new : q.category
      }))
      setQuestions(updatedQuestions)
      localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions))

      setEditingCategory(null)
    }
  }

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.category) {
      const updatedQuestions = [...questions, { ...newQuestion, id: Date.now() }]
      setQuestions(updatedQuestions)
      localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions))
      setNewQuestion({
        id: 0,
        text: '',
        options: [''],
        category: categories[0],
        optionScores: [0]
      })
    }
  }

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter(q => q.id !== id)
    setQuestions(updatedQuestions)
    localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions))
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
  }

  const handleUpdateQuestion = () => {
    if (editingQuestion) {
      const updatedQuestions = questions.map(q => 
        q.id === editingQuestion.id ? editingQuestion : q
      )
      setQuestions(updatedQuestions)
      localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions))
      setEditingQuestion(null)
    }
  }

  const handleOptionChange = (index: number, value: string, isEditing: boolean = false) => {
    const updatedOptions = isEditing 
      ? [...(editingQuestion?.options || [])]
      : [...newQuestion.options]
    updatedOptions[index] = value
    if (isEditing && editingQuestion) {
      setEditingQuestion({ ...editingQuestion, options: updatedOptions })
    } else {
      setNewQuestion({ ...newQuestion, options: updatedOptions })
    }
  }

  const handleScoreChange = (index: number, value: string, isEditing: boolean = false) => {
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return

    const updatedScores = isEditing
      ? [...(editingQuestion?.optionScores || [])]
      : [...newQuestion.optionScores]
    updatedScores[index] = Math.min(Math.max(numValue, 0), 100)
    if (isEditing && editingQuestion) {
      setEditingQuestion({ ...editingQuestion, optionScores: updatedScores })
    } else {
      setNewQuestion({ ...newQuestion, optionScores: updatedScores })
    }
  }

  const handleAddOption = (isEditing: boolean = false) => {
    if (isEditing && editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        options: [...editingQuestion.options, ''],
        optionScores: [...editingQuestion.optionScores, 0]
      })
    } else {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, ''],
        optionScores: [...newQuestion.optionScores, 0]
      })
    }
  }

  const handleRemoveOption = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingQuestion) {
      const updatedOptions = [...editingQuestion.options]
      const updatedScores = [...editingQuestion.optionScores]
      updatedOptions.splice(index, 1)
      updatedScores.splice(index, 1)
      setEditingQuestion({
        ...editingQuestion,
        options: updatedOptions,
        optionScores: updatedScores
      })
    } else {
      const updatedOptions = [...newQuestion.options]
      const updatedScores = [...newQuestion.optionScores]
      updatedOptions.splice(index, 1)
      updatedScores.splice(index, 1)
      setNewQuestion({
        ...newQuestion,
        options: updatedOptions,
        optionScores: updatedScores
      })
    }
  }

  return (
    <div className="customize-questionnaire">
      <h2>{t('customize.title')}</h2>
      
      <div className="category-management">
        <h3>{t('customize.manageCategories')}</h3>
        <div className="new-category">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t('customize.newCategoryPlaceholder')}
          />
          <button onClick={handleAddCategory}>{t('customize.addCategory')}</button>
        </div>
        <ul className="category-list">
          {categories.map((category, index) => (
            <li key={index}>
              {editingCategory && editingCategory.old === category ? (
                <>
                  <input
                    type="text"
                    value={editingCategory.new}
                    onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                  />
                  <button onClick={handleUpdateCategory}>{t('customize.saveCategory')}</button>
                  <button onClick={() => setEditingCategory(null)}>{t('customize.cancelEdit')}</button>
                </>
              ) : (
                <>
                  {category}
                  <button onClick={() => setEditingCategory({ old: category, new: category })}>{t('customize.editCategory')}</button>
                  <button onClick={() => handleDeleteCategory(category)}>{t('customize.deleteCategory')}</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="new-question">
        <h3>{t('customize.addNewQuestion')}</h3>
        <input
          type="text"
          placeholder={t('customize.questionText')}
          value={newQuestion.text}
          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
        />
        <select
          value={newQuestion.category}
          onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
        >
          <option value="">{t('customize.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {newQuestion.options.map((option, index) => (
          <div key={index} className="option-input">
            <input
              type="text"
              placeholder={`${t('customize.option')} ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <input
              type="number"
              placeholder={t('customize.score')}
              value={newQuestion.optionScores[index]}
              onChange={(e) => handleScoreChange(index, e.target.value)}
              min="0"
              max="100"
            />
            <button onClick={() => handleRemoveOption(index)}>{t('customize.removeOption')}</button>
          </div>
        ))}
        <button onClick={() => handleAddOption()}>{t('customize.addOption')}</button>
        <button onClick={handleAddQuestion}>{t('customize.addQuestion')}</button>
      </div>

      <div className="question-list">
        <h3>{t('customize.existingQuestions')}</h3>
        {categories.map(category => (
          <div key={category} className="category-section">
            <h4>{category}</h4>
            <ol>
              {questions.filter(q => q.category === category).map((question) => (
                <li key={question.id}>
                  {editingQuestion && editingQuestion.id === question.id ? (
                    <div className="editing-question">
                      <input
                        type="text"
                        value={editingQuestion.text}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                      />
                      <select
                        value={editingQuestion.category}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {editingQuestion.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-input">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(optionIndex, e.target.value, true)}
                          />
                          <input
                            type="number"
                            value={editingQuestion.optionScores[optionIndex]}
                            onChange={(e) => handleScoreChange(optionIndex, e.target.value, true)}
                            min="0"
                            max="100"
                          />
                          <button onClick={() => handleRemoveOption(optionIndex, true)}>{t('customize.removeOption')}</button>
                        </div>
                      ))}
                      <button onClick={() => handleAddOption(true)}>{t('customize.addOption')}</button>
                      <button onClick={handleUpdateQuestion}>{t('customize.saveChanges')}</button>
                      <button onClick={() => setEditingQuestion(null)}>{t('customize.cancelEdit')}</button>
                    </div>
                  ) : (
                    <div className="question-item">
                      <p>{question.text}</p>
                      <ul>
                        {question.options.map((option, optionIndex) => (
                          <li key={optionIndex}>{option} ({t('customize.score')}: {question.optionScores[optionIndex]})</li>
                        ))}
                      </ul>
                      <button onClick={() => handleEditQuestion(question)}>{t('customize.edit')}</button>
                      <button onClick={() => handleDeleteQuestion(question.id)}>{t('customize.delete')}</button>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomizeQuestionnaire