import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Target, BarChart3 } from "lucide-react";
import StatCard from "../components/StatCard";
import SpendingChart from "../charts/SpendingChart";
import { generateAnalytics } from "../utils/analyticsEngine";
import ExpenseCategoryChart from "../charts/ExpenseCategoryChart";
import IncomeCategoryChart from "../charts/IncomeCategoryChart";
import { useFinance } from "../context/FinanceContext";
import Goals from "../pages/Goals";
import "../styles/dashboard.css";
import { useNotifications } from "../context/NotificationContext";

function Dashboard() {
  const { transactions, goals = [] } = useFinance();
  const analytics = generateAnalytics(transactions);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  /* ================= MONTH FILTER ================= */

  const months = [
    "Total",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short" }),
  );

  const filteredTransactions =
    selectedMonth === "Total"
      ? transactions
      : transactions.filter((t) => {
          const m = new Date(t.date).toLocaleString("default", {
            month: "short",
          });
          return m === selectedMonth;
        });

  /* ================= GOAL SAVINGS ================= */

  const goalSavings = goals.reduce((total, goal) => {
    if (!goal.lastUpdated) return total;

    const date = new Date(goal.lastUpdated);
    if (isNaN(date)) return total;

    const goalMonth = date.toLocaleString("default", { month: "short" });

    if (selectedMonth === "Total" || goalMonth === selectedMonth) {
      return total + Number(goal.saved || 0);
    }

    return total;
  }, 0);

  /* ================= CALCULATIONS ================= */

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const rawBalance = income - expenses;
  const balance = rawBalance - goalSavings;

  const savingsRate = income > 0 ? (goalSavings / income) * 100 : 0;

  /* ================= CATEGORY ================= */

  const categoryTotals = {};
  filteredTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += Number(t.amount);
    });

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  /* ================= RECENT ================= */

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  /* ================= INSIGHTS ================= */

  let heroMessage = "Your finances look stable";

  if (savingsRate > 25) heroMessage = "Excellent savings this month 🔥";
  else if (savingsRate > 10) heroMessage = "Good financial control 👍";
  else heroMessage = "⚠ Watch your spending";

  const insights = [
    heroMessage,
    `Savings rate: ${savingsRate.toFixed(0)}%`,
    ...(goalSavings > 0 ? [`₹${goalSavings} moved to savings goals`] : []),
    topCategory ? `Top spending: ${topCategory[0]}` : "No expense data",
    balance >= 0 ? `Balance ₹${balance}` : `⚠ Negative balance ₹${balance}`,
  ];

  /* ================= ROTATION ================= */

  const [currentInsight, setCurrentInsight] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [insights.length, isPaused]);

  const getClass = (text) => {
    if (text.includes("⚠")) return "danger";
    if (text.includes("Excellent") || text.includes("Good")) return "positive";
    return "warning";
  };

  const getTransactionDayTrend = (type) => {
    const today = new Date();
    const year = today.getFullYear();

    const month =
      selectedMonth === "Total"
        ? today.getMonth()
        : new Date(`${selectedMonth} 1, ${year}`).getMonth();

    const map = {};

    transactions.forEach((t) => {
      const d = new Date(t.date);

      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.type === type) {
          const day = d.getDate();

          if (!map[day]) map[day] = 0;
          map[day] += Number(t.amount);
        }
      }
    });

    return Object.entries(map)
      .sort((a, b) => a[0] - b[0])
      .map(([_, val]) => val);
  };

  const incomeTrend = getTransactionDayTrend("income");
  const expenseTrend = getTransactionDayTrend("expense");

  const balanceTrend = incomeTrend.map((v, i) => v - (expenseTrend[i] || 0));

  /* ================= STATS ================= */

  const stats = [
    {
      title: "Balance",
      amount: `₹${balance}`,
      change: balance >= 0 ? "+Stable" : "-Drop",
      data: balanceTrend,
    },
    {
      title: "Income",
      amount: `₹${income}`,
      change: "+Cashflow",
      data: incomeTrend,
    },
    {
      title: "Expenses",
      amount: `₹${expenses}`,
      change: "-Spending",
      data: expenseTrend,
    },
    {
      title: "Savings",
      amount: `₹${goalSavings}`,
      change: `+${savingsRate.toFixed(0)}% invested`,
      data: balanceTrend,
    },
  ];

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-top">
        <h2>Dashboard</h2>

        {/* CENTER INSIGHTS */}
        <div
          className="insights-box"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <span className="insights-label">Insights</span>

          <div className={`insight-item ${getClass(insights[currentInsight])}`}>
            {insights[currentInsight]}
          </div>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="top-controls">
          <div className="actions-panel">
            <button onClick={() => navigate("/transactions")}>
              <Plus size={16} /> Add
            </button>

            <button onClick={() => navigate("/budgets")}>
              <Target size={16} /> Budget
            </button>

            <button onClick={() => navigate("/analytics")}>
              <BarChart3 size={16} /> Analytics
            </button>
          </div>
<select
  value={selectedMonth}
  onChange={(e) => {
    const newMonth = e.target.value;

    const currentMonthIndex = new Date().getMonth();
    const selectedMonthIndex = months.indexOf(newMonth)-1;

    if (newMonth !== "Total" && selectedMonthIndex > currentMonthIndex) {
      addNotification("Future data is not available yet", "warning");
      return;
    }

    setSelectedMonth(newMonth);
  }}
>
  {months.map((m, index) => (
    <option
      key={m}
      disabled={m !== "Total" && index - 1 > new Date().getMonth()}
    >
      {m}
    </option>
  ))}
</select>

        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <SpendingChart data={analytics.monthlyTrend} />
        <ExpenseCategoryChart transactions={filteredTransactions} />
        <IncomeCategoryChart transactions={filteredTransactions} />
      </div>

      {/* TABLE */}
      <div className="bottom-grid">
        <div className="recent-box">
          <h3>Recent Transactions</h3>

          <table className="recent-table">
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
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* GOALS */}
        <div className="goals-dashboard">
          <Goals />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
