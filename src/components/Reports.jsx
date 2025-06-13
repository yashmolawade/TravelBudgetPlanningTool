import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Download, Calendar, TrendingUp, FileText } from "lucide-react";
import {
  formatCurrency,
  calculateCategoryTotals,
  groupExpensesByDate,
} from "../utils/helpers";
import { generatePDFReport } from "../utils/pdfGenerator";

const Reports = ({ expenses, budgets, categories }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("all"); // all, last7days, last30days, last3months
  const theme = useSelector((state) => state.ui.theme);

  const categoryTotals = useMemo(
    () => calculateCategoryTotals(expenses),
    [expenses]
  );

  // Filter expenses based on selected period
  const filteredExpenses = useMemo(() => {
    if (selectedPeriod === "all") return expenses;

    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedPeriod) {
      case "last7days":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "last30days":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "last3months":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return expenses;
    }

    return expenses.filter((expense) => new Date(expense.date) >= cutoffDate);
  }, [expenses, selectedPeriod]);

  const dailyExpenses = useMemo(
    () => groupExpensesByDate(filteredExpenses),
    [filteredExpenses]
  );

  const dailyData = Object.entries(dailyExpenses)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalBudget = Object.values(budgets).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const categoryReport = categories
    .map((category) => ({
      category,
      spent: categoryTotals[category] || 0,
      budget: budgets[category] || 0,
      remaining: Math.max(
        0,
        (budgets[category] || 0) - (categoryTotals[category] || 0)
      ),
      percentage:
        budgets[category] > 0
          ? ((categoryTotals[category] || 0) / budgets[category]) * 100
          : 0,
    }))
    .filter((item) => item.spent > 0 || item.budget > 0);

  const exportCSV = () => {
    const csvContent = [
      ["Date", "Description", "Category", "Amount", "Notes"],
      ...filteredExpenses.map((expense) => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount,
        expense.notes || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `travel-expenses-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    generatePDFReport({
      expenses: filteredExpenses,
      budgets,
      categories,
      categoryTotals,
      totalSpent,
      totalBudget,
      selectedPeriod,
    });
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "last7days":
        return "Last 7 Days";
      case "last30days":
        return "Last 30 Days";
      case "last3months":
        return "Last 3 Months";
      default:
        return "All Time";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card bg-white dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last3months">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredExpenses.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getPeriodLabel()}
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getPeriodLabel()}
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Average Daily Spend
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dailyData.length > 0
                  ? formatCurrency(totalSpent / dailyData.length)
                  : formatCurrency(0)}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                Avg
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Daily average
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Budget Adherence
              </p>
              <p
                className={`text-2xl font-bold ${
                  totalSpent <= totalBudget
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {totalBudget > 0
                  ? Math.round((totalSpent / totalBudget) * 100)
                  : 0}
                %
              </p>
            </div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                totalSpent <= totalBudget
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  totalSpent <= totalBudget
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {totalSpent <= totalBudget ? "✓" : "!"}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            vs total budget
          </p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="card bg-white dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export Reports
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={exportCSV}
              className="btn-secondary flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportPDF}
              className="btn-primary flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Spending Chart */}
      {dailyData.length > 0 && (
        <div className="card bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Spending Trend - {getPeriodLabel()}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
                  border: "none",
                  borderRadius: "0.375rem",
                }}
                labelStyle={{ color: theme === "dark" ? "#F3F4F6" : "#1F2937" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Performance */}
      <div className="card bg-white dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Performance - {getPeriodLabel()}
        </h3>
        {categoryReport.length > 0 ? (
          <div className="space-y-4">
            {categoryReport.map((item) => (
              <div
                key={item.category}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.category}
                  </h4>
                  <span
                    className={`text-sm font-medium ${
                      item.percentage <= 100
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.percentage.toFixed(1)}% used
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Spent</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.spent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Budget</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Remaining
                    </p>
                    <p
                      className={`font-semibold ${
                        item.remaining >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(item.remaining)}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.percentage <= 100
                          ? "bg-green-500 dark:bg-green-400"
                          : "bg-red-500 dark:bg-red-400"
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No data available for category analysis
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;
