import jsPDF from "jspdf";
import { useFinance } from "../context/FinanceContext";

function MonthlyReport({ report, onBack }) {
  const { transactions = [], expenseCategories = [] } = useFinance();

  /* ---------- FILTER TRANSACTIONS BY MONTH ---------- */

  const monthIndexMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const reportMonthIndex = monthIndexMap[report.month];
  const reportYear = new Date().getFullYear(); // ✅ FIX

  const filteredTransactions = transactions.filter((t) => {
    const d = new Date(t.date);

    return d.getMonth() === reportMonthIndex && d.getFullYear() === reportYear;
  });

  const sortedFiltered = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  /* ---------- CALCULATIONS ---------- */

  const totalExpense = report.expense || 1;

  const savingsRate = report.income
    ? Math.round((report.savings / report.income) * 100)
    : 0;

  const getStatus = () => {
    if (report.savings > 0) return "Healthy";
    if (report.savings === 0) return "Neutral";
    return "Risk";
  };

  const expenseCategoryNames = expenseCategories.map((c) => c.name);

  const sortedCategories = Object.entries(report.categories || {})
    .filter(([cat]) => expenseCategoryNames.includes(cat))
    .sort((a, b) => b[1] - a[1]);

  /* ---------- HIGHLIGHTS ---------- */

  const highlights = [];

  if (report.savings > 0) {
    highlights.push(`You saved ₹${report.savings} this month`);
  } else {
    highlights.push(`Expenses exceeded income`);
  }

  if (sortedCategories.length > 0) {
    const [topCat, topVal] = sortedCategories[0];
    const percent = Math.round((topVal / totalExpense) * 100);

    highlights.push(`${topCat} is your highest expense (${percent}%)`);
  }

  if (savingsRate > 20) {
    highlights.push("Good financial control this month");
  } else {
    highlights.push("Try improving your savings rate");
  }

  /* ---------- PDF ---------- */

  const handleDownload = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const margin = 15;
    let y = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("FinancePro", margin, y);

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${report.month} Financial Report`, margin, y + 6);

    pdf.line(margin, y + 10, pageWidth - margin, y + 10);
    y += 18;

    pdf.text(`Status: ${getStatus()}`, margin, y);
    pdf.text(`Savings Rate: ${savingsRate}%`, pageWidth - 70, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.text("Summary", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");

    const summary = [
      `Income: ₹${report.income}`,
      `Expense: ₹${report.expense}`,
      `Savings: ₹${report.savings}`,
      `Transactions: ${report.transactions}`,
    ];

    summary.forEach((item) => {
      pdf.text(item, margin, y);
      y += 6;
    });

    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.text("Highlights", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    highlights.forEach((h) => {
      pdf.text(`• ${h}`, margin, y);
      y += 6;
    });

    y += 4;
    pdf.setFont("helvetica", "bold");
    pdf.text("Top Categories", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");

    sortedCategories.forEach(([cat, val]) => {
      const percent = Math.round((val / totalExpense) * 100);

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(cat, margin, y);
      pdf.text(`₹${val}`, margin + 80, y);
      pdf.text(`${percent}%`, pageWidth - 30, y);

      y += 6;
    });

    /* Transactions table included now */

    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Transactions", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");

    filteredTransactions.forEach((t) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(`${t.date} | ${t.category} | ₹${t.amount}`, margin, y);

      y += 6;
    });

    const date = new Date().toLocaleDateString();
    pdf.setFontSize(9);
    pdf.text(`Generated on ${date}`, margin, 290);

    pdf.save(`${report.month}-report.pdf`);
  };

  return (
    <div className="monthly-report">
      <div className="report-header">
        <button onClick={onBack}>← Back</button>
        <h2>{report.month} Financial Report</h2>
        <button className="download-btn" onClick={handleDownload}>
          ⬇ Download
        </button>
      </div>

      <div id="report-content">
        <div className="report-status">
          <span className={`status-badge ${getStatus().toLowerCase()}`}>
            Status : {getStatus()}
          </span>
          <span>Savings Rate: {savingsRate}%</span>
        </div>

        <div className="report-summary">
          <div className="card income">
            +₹{report.income}
            <span>Income</span>
          </div>
          <div className="card expense">
            ₹{report.expense}
            <span>Expense</span>
          </div>
          <div className="card savings">
            ₹{report.savings}
            <span>Savings</span>
          </div>
          <div className="card txn">
            {report.transactions}
            <span>Transactions</span>
          </div>
        </div>

        <h3>Highlights</h3>
        <div className="highlights">
          {highlights.map((h, i) => (
            <div key={i} className="highlight-item">
              {h}
            </div>
          ))}
        </div>

        <div className="report-split">
          {/* LEFT SIDE */}
          <div className="left-panel">
            <h3>{report.month}  Transactions</h3>

            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>

                    <th>Amount</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    sortedFiltered.map((t) => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td>{t.type}</td>
                        <td>{t.category}</td>
                        <td
                          className={t.type === "income" ? "income" : "expense"}
                        >
                          ₹{t.amount}
                        </td>
                        <td>{t.paymentMethod}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
</div>
            {/* RIGHT SIDE */}
            <div className="right-panel">
              <h3>Expense Categories</h3>

              <div className="category-list">
                {sortedCategories.map(([cat, val]) => {
                  const percent = Math.round((val / totalExpense) * 100);

                  return (
                    <div key={cat} className="category-row">
                      <div className="cat-header">
                        <span>{cat}</span>
                        <span>₹{val}</span>
                      </div>
                      <div className="bar">
                        <div
                          className="fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="percent">{percent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default MonthlyReport;
