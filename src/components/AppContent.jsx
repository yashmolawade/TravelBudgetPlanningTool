import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import Dashboard from "./Dashboard";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import BudgetSettings from "./BudgetSettings";
import Reports from "./Reports";
import CurrencyConverter from "./CurrencyConverter";
import { useFirebaseSync } from "../hooks/useFirebaseSync";
import { selectActiveTab } from "../store/slices/uiSlice";
import { selectAllExpenses } from "../store/slices/expensesSlice";
import { selectAllBudgets } from "../store/slices/budgetsSlice";

const AppContent = ({ onLogoClick }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const expenses = useSelector(selectAllExpenses);
  const budgets = useSelector(selectAllBudgets);

  const categories = [
    "Accommodation",
    "Food & Dining",
    "Transportation",
    "Activities",
    "Shopping",
    "Entertainment",
    "Emergency",
    "Other",
  ];

  // Handle Firebase synchronization
  useFirebaseSync();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            expenses={expenses}
            budgets={budgets}
            categories={categories}
          />
        );

      case "add-expense":
        return <ExpenseForm categories={categories} />;

      case "expenses":
        return <ExpenseList expenses={expenses} categories={categories} />;

      case "budget":
        return <BudgetSettings categories={categories} budgets={budgets} />;

      case "reports":
        return (
          <Reports
            expenses={expenses}
            budgets={budgets}
            categories={categories}
          />
        );

      case "converter":
        return <CurrencyConverter />;

      default:
        return (
          <Dashboard
            expenses={expenses}
            budgets={budgets}
            categories={categories}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onLogoClick={onLogoClick} />

      <main className="container mx-auto px-4 py-8">{renderActiveTab()}</main>
    </div>
  );
};

export default AppContent;
