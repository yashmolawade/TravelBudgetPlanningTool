import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Save, X } from 'lucide-react'
import { addExpense } from '../store/slices/expensesSlice'
import { setActiveTab, addNotification } from '../store/slices/uiSlice'

const ExpenseForm = ({ categories }) => {
  const dispatch = useDispatch()
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories[0],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Dispatch action to add expense
      dispatch(addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      }))
      
      // Add success notification
      dispatch(addNotification({
        type: 'success',
        message: 'Expense added successfully!',
        title: 'Success'
      }))
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: categories[0],
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      
      // Navigate back to dashboard
      dispatch(setActiveTab('dashboard'))
    }
  }

  const handleCancel = () => {
    dispatch(setActiveTab('dashboard'))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="e.g., Hotel booking, Restaurant dinner"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`input-field ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Additional notes about this expense..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 flex-1"
            >
              <Save className="h-4 w-4" />
              <span>Save Expense</span>
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm