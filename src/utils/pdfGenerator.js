import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDFReport = ({
  expenses,
  budgets,
  categories,
  categoryTotals,
  totalSpent,
  totalBudget,
  selectedPeriod,
}) => {
  const doc = new jsPDF();

  // Set up the document
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = margin;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Travel Buddy Report", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Report metadata
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${reportDate}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Period: ${getPeriodLabel(selectedPeriod)}`, margin, yPosition);
  yPosition += 20;

  // Summary section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", margin, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const summaryData = [
    ["Total Expenses", expenses.length.toString()],
    ["Total Amount Spent", formatCurrency(totalSpent)],
    ["Total Budget", formatCurrency(totalBudget)],
    ["Remaining Budget", formatCurrency(totalBudget - totalSpent)],
    [
      "Budget Usage",
      totalBudget > 0
        ? `${Math.round((totalSpent / totalBudget) * 100)}%`
        : "0%",
    ],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: margin, right: margin },
  });

  yPosition = doc.lastAutoTable.finalY + 20;

  // Category breakdown
  if (yPosition > 200) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Category Breakdown", margin, yPosition);
  yPosition += 10;

  const categoryData = categories
    .filter(
      (category) =>
        (categoryTotals[category] || 0) > 0 || (budgets[category] || 0) > 0
    )
    .map((category) => {
      const spent = categoryTotals[category] || 0;
      const budget = budgets[category] || 0;
      const remaining = budget - spent;
      const percentage = budget > 0 ? ((spent / budget) * 100).toFixed(1) : "0";

      return [
        category,
        formatCurrency(spent),
        formatCurrency(budget),
        formatCurrency(remaining),
        `${percentage}%`,
      ];
    });

  if (categoryData.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [["Category", "Spent", "Budget", "Remaining", "Usage %"]],
      body: categoryData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: margin, right: margin },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
    });
    yPosition = doc.lastAutoTable.finalY + 20;
  }

  // Detailed expenses
  if (expenses.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Expenses", margin, yPosition);
    yPosition += 10;

    const expenseData = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((expense) => [
        expense.date,
        expense.description,
        expense.category,
        formatCurrency(expense.amount),
        expense.notes || "",
      ]);

    doc.autoTable({
      startY: yPosition,
      head: [["Date", "Description", "Category", "Amount", "Notes"]],
      body: expenseData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 35 },
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `travel-budget-report-${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const getPeriodLabel = (period) => {
  switch (period) {
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
