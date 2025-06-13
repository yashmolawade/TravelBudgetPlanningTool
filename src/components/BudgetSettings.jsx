import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Save, Target, AlertCircle, Trash2 } from "lucide-react";
import {
  updateBudget,
  updateMultipleBudgets,
  clearBudgets,
} from "../store/slices/budgetsSlice";
import { addNotification } from "../store/slices/uiSlice";
import { formatCurrency } from "../utils/helpers";

const BudgetSettings = ({ categories, budgets }) => {
  const dispatch = useDispatch();

  const [localBudgets, setLocalBudgets] = useState(budgets);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBudgetChange = (category, value) => {
    const numericValue = parseFloat(value) || 0;
    setLocalBudgets((prev) => ({
      ...prev,
      [category]: numericValue,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Update all budgets at once
    dispatch(updateMultipleBudgets(localBudgets));

    dispatch(
      addNotification({
        type: "success",
        message: "Budget settings saved successfully!",
        title: "Success",
      })
    );

    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalBudgets(budgets);
    setHasChanges(false);
  };

  const handleDeleteAllBudgets = () => {
    dispatch(clearBudgets());
    setLocalBudgets({});
    setHasChanges(false);
    setShowDeleteConfirm(false);

    dispatch(
      addNotification({
        type: "success",
        message: "All budgets have been cleared successfully!",
        title: "Budgets Cleared",
      })
    );
  };

  const totalBudget = Object.values(localBudgets).reduce(
    (sum, amount) => sum + (amount || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Budget Settings
            </h2>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Budget
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>

        {hasChanges && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-800 dark:text-yellow-200">
                You have unsaved changes
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {category}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={localBudgets[category] || ""}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  className="input-field pl-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {localBudgets[category] > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Budget: {formatCurrency(localBudgets[category])}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`btn-primary flex items-center justify-center space-x-2 ${
              !hasChanges ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Save Budget Settings</span>
          </button>

          {hasChanges && (
            <button onClick={handleReset} className="btn-secondary">
              Reset Changes
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-secondary flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800 bg-white dark:bg-gray-800"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Budgets</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clear All Budgets
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to clear all budget settings? This action
              cannot be undone and is useful when starting a new trip.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAllBudgets}
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tips */}
      <div className="card bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          Budget Planning Tips
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
          <li>
            • Set realistic budgets based on your travel destination and
            duration
          </li>
          <li>• Allocate 10-20% extra for unexpected expenses</li>
          <li>
            • Research average costs for accommodation, food, and activities in
            your destination
          </li>
          <li>
            • Consider seasonal price variations when planning your budget
          </li>
          <li>
            • Review and adjust your budgets based on actual spending patterns
          </li>
          <li>
            • Use "Clear All Budgets" when starting a new trip to reset your
            planning
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetSettings;
