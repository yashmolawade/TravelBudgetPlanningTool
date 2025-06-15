import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Save, X } from "lucide-react";
import { addExpense } from "../store/slices/expensesSlice";
import { setActiveTab, addNotification } from "../store/slices/uiSlice";

const ExpenseForm = ({ categories }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: categories[0],
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Format amount to ensure proper decimal handling
  const formatAmount = useCallback((value) => {
    // Remove any non-numeric characters except decimal point
    let cleanValue = value.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      cleanValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      cleanValue = parts[0] + "." + parts[1].substring(0, 2);
    }

    // Remove leading zeros
    if (
      cleanValue.startsWith("0") &&
      cleanValue.length > 1 &&
      cleanValue[1] !== "."
    ) {
      cleanValue = cleanValue.substring(1);
    }

    return cleanValue;
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "amount") {
        const formattedValue = formatAmount(value);
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors, formatAmount]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 100) {
      newErrors.description = "Description must be less than 100 characters";
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount)) {
      newErrors.amount = "Amount must be a valid number";
    } else if (amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (amount > 1000000) {
      newErrors.amount = "Amount must be less than 1,000,000";
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    // Validate notes length
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Notes must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (validateForm()) {
        // Round the amount to 2 decimal places
        const roundedAmount =
          Math.round(parseFloat(formData.amount) * 100) / 100;

        // Dispatch action to add expense
        dispatch(
          addExpense({
            ...formData,
            amount: roundedAmount,
            description: formData.description.trim(),
            notes: formData.notes.trim(),
          })
        );

        // Add success notification
        dispatch(
          addNotification({
            type: "success",
            message: "Expense added successfully!",
            title: "Success",
          })
        );

        // Reset form
        setFormData({
          description: "",
          amount: "",
          category: categories[0],
          date: new Date().toISOString().split("T")[0],
          notes: "",
        });

        // Navigate back to dashboard
        dispatch(setActiveTab("dashboard"));
      }
    },
    [formData, validateForm, dispatch, categories]
  );

  const handleCancel = useCallback(() => {
    dispatch(setActiveTab("dashboard"));
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Expense
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={100}
              className={`input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="e.g., Hotel booking, Restaurant dinner"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`input-field pl-7 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    errors.amount ? "border-red-500" : ""
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.amount}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={`input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.date ? "border-red-500" : ""
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              maxLength={500}
              rows="3"
              className={`input-field bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors.notes ? "border-red-500" : ""
              }`}
              placeholder="Add any additional details about this expense..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.notes}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save className="h-5 w-5 mr-2 inline" />
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
