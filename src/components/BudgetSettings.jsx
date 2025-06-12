import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Save, Target, AlertCircle } from 'lucide-react'
import { updateBudget, updateMultipleBudgets } from '../store/slices/budgetsSlice'
import { addNotification } from '../store/slices/uiSlice'
import { formatCurrency } from '../utils/helpers'

const BudgetSettings = ({ categories, budgets }) => {
  const dispatch = useDispatch()
  
  const [localBudgets, setLocalBudgets] = useState(budgets)
  const [hasChanges, setHasChanges] = useState(false)

  const handleBudgetChange = (category, value) => {
    const numericValue = parseFloat(value) || 0
    setLocalBudgets(prev => ({
      ...prev,
      [category]: numericValue
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Update all budgets at once
    dispatch(updateMultipleBudgets(localBudgets))
    
    dispatch(addNotification({
      type: 'success',
      message: 'Budget settings saved successfully!',
      title: 'Success'
    }))
    
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalBudgets(budgets)
    setHasChanges(false)
  }

  const totalBudget = Object.values(localBudgets).reduce((sum, amount) => sum + (amount || 0), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Budget Settings</h2>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-primary-600">{formatCurrency(totalBudget)}</p>
          </div>
        </div>

        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">You have unsaved changes</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {category}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={localBudgets[category] || ''}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  className="input-field pl-8"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {localBudgets[category] > 0 && (
                <p className="text-xs text-gray-500">
                  Budget: {formatCurrency(localBudgets[category])}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`btn-primary flex items-center space-x-2 ${
              !hasChanges ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Save Budget Settings</span>
          </button>
          
          {hasChanges && (
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset Changes
            </button>
          )}
        </div>
      </div>

      {/* Budget Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Budget Planning Tips</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Set realistic budgets based on your travel destination and duration</li>
          <li>• Allocate 10-20% extra for unexpected expenses</li>
          <li>• Research average costs for accommodation, food, and activities in your destination</li>
          <li>• Consider seasonal price variations when planning your budget</li>
          <li>• Review and adjust your budgets based on actual spending patterns</li>
        </ul>
      </div>
    </div>
  )
}

export default BudgetSettings