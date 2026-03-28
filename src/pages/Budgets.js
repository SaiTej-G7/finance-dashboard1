import { useEffect, useState, useRef,useMemo} from "react";
import React from "react"; 
import { useFinance } from "../context/FinanceContext";
import Goals from "../pages/Goals";
import "../styles/budgets.css";
import { useNotifications } from "../context/NotificationContext";

 function Budgets() {
  const { budgets, updateBudget, transactions } = useFinance();
  const { addNotification } = useNotifications();

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short" })
  );

  const [tooltip, setTooltip] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [selectedMonth]);

  const colors = {
    Food: "#d56745",
    Transport: "#4c26f7",
    Bills: "#11b63f",
    Shopping: "#eca922",
    Entertainment: "#ae1be8",
    Health: "#ecdf1f",
    Education: "#b4bfcb",
    Travel: "#eb1bb3",
    Others: "#16ebe0",
  };

  /* ---------- CATEGORY SPENDING ---------- */

const categorySpending = useMemo(() => {
  const map = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const m = new Date(t.date).toLocaleString("default", { month: "short" });
      if (m !== selectedMonth) return;

      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += Number(t.amount);
    });

  return map;
}, [transactions, selectedMonth]);

const categories = useMemo(() => {
  return Object.keys(categorySpending).sort(
    (a, b) => categorySpending[b] - categorySpending[a]
  );
}, [categorySpending]);

  /* ---------- SUMMARY ---------- */

  const totalSpent = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const totalBudget = budgets.reduce((a, b) => a + Number(b.limit || 0), 0);
  const remaining = totalBudget - totalSpent;

  const daysLeft =
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
    new Date().getDate();

  /* ---------- INSIGHTS ---------- */

  const insights = [];

  if (remaining > 0) insights.push("✔ You are within budget");
  else insights.push("⚠ You exceeded your budget");

  if (categories.length > 0) {
    insights.push(`📊 Highest spending: ${categories[0]}`);
  }

  if (remaining > 0) {
    insights.push(`💡 You can still spend ₹${remaining}`);
  }

  /* ---------- INLINE EDIT ---------- */

  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleRingClick = (e, category, currentLimit) => {
    setEditing({
      category,
      x: e.clientX,
      y: e.clientY,
    });

    setEditValue(currentLimit || "");
  };

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setEditing(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ---------- 🔔 NOTIFICATIONS (FIXED) ---------- */

  const notifiedRef = useRef({});

  useEffect(() => {
  if (!categories.length) return;

  categories.forEach((category) => {
    const spent = categorySpending[category] || 0;
    const budget = budgets.find((b) => b.category === category);
    const limit = budget ? Number(budget.limit) : 0;

    const isExceeded = limit > 0 && spent > limit;

    if (isExceeded && !notifiedRef.current[category]) {
      addNotification(`⚠ ${category} budget exceeded`, "error");
      notifiedRef.current[category] = true;
    }

    if (!isExceeded) {
      notifiedRef.current[category] = false;
    }
  });

}, [categories, categorySpending, budgets, addNotification]);

  /* ---------- UI ---------- */

  return (
    <div className="budget-page">
      <h2 className="budget-header">Budget</h2>

      <div className="budget-grid">

        {/* RINGS */}
        <div className="rings-section">
          <div className="rings-header">
            <h3>Monthly Budget Control Center</h3>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="ring-wrapper">
            <svg width="260" height="260">
              {categories.map((category, index) => {
                const spent = categorySpending[category] || 0;
                const budget = budgets.find((b) => b.category === category);
                const limit = budget ? budget.limit : spent;

                const percent = limit ? spent / limit : 0;

                const radius = 120 - index * 12;
                const circumference = 2 * Math.PI * radius;

                const offset = animate
                  ? circumference - percent * circumference
                  : circumference;

                const startAngle =
                  -90 + index * 15 + (index % 2 ? 10 : -10);

                return (
                  <g key={category}>
                    <circle
                      cx="130"
                      cy="130"
                      r={radius}
                      strokeWidth="10"
                      stroke="var(--ring-bg)"
                      fill="none"
                    />

                    <circle
                      cx="130"
                      cy="130"
                      r={radius}
                      strokeWidth={spent > limit ? 12 : 10}
                      stroke={spent > limit ? "#ef4444" : colors[category]}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="ring-progress"
                      style={{
                        transform: `rotate(${startAngle}deg)`,
                        transformOrigin: "50% 50%",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRingClick(e, category, limit);
                      }}
                      onMouseEnter={(e) => {
                        const remaining = Math.max(limit - spent, 0);
                        const overBudget = Math.max(spent - limit, 0);

                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          category,
                          spent,
                          limit,
                          remaining,
                          overBudget,
                          percent: Math.round(percent * 100),
                        });
                      }}
                      onMouseMove={(e) =>
                        setTooltip((t) =>
                          t ? { ...t, x: e.clientX, y: e.clientY } : null
                        )
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* TOOLTIP */}
          {tooltip && (
            <div
              className="ring-tooltip"
              style={{ top: tooltip.y + 10, left: tooltip.x + 20 }}
            >
              <strong>{tooltip.category}</strong>
              <div>Spent: ₹{tooltip.spent}</div>
              <div>Limit: ₹{tooltip.limit}</div>

              {tooltip.overBudget > 0 ? (
                <div style={{ color: "#ef4444" }}>
                  Over Budget: ₹{tooltip.overBudget}
                </div>
              ) : (
                <div style={{ color: "#22c55e" }}>
                  Remaining: ₹{tooltip.remaining}
                </div>
              )}

              <div>{tooltip.percent}% used</div>
            </div>
          )}

          {/* EDIT POPUP */}
          {editing && (
            <div
              ref={popupRef}
              className="edit-popup"
              style={{
                top: editing.y + 10,
                left: editing.x + 20,
              }}
            >
              <strong>{editing.category}</strong>

              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />

              <div className="edit-actions">
                <button
                  onClick={() => {
                    updateBudget({
                      category: editing.category,
                      limit: Number(editValue),
                    });
                    setEditing(null);
                  }}
                >
                  Save
                </button>

                <button onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="summary-wrapper">
          <h3>Budget Summary</h3>

          <div className="summary-section">
            <div className="summary-card">
              <span>Total Budget</span>₹{totalBudget}
            </div>

            <div className="summary-card">
              <span>Spent</span>₹{totalSpent}
            </div>

            <div className="summary-card">
              <span>Remaining</span>₹{remaining}
            </div>

            <div className="summary-card">
              <span>Days Left</span>
              {daysLeft}
            </div>
          </div>

          <div className="insights-section">
            <h3>Budget Insights</h3>
            {insights.map((i, idx) => (
              <div key={idx} className="insight-item">
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* GOALS */}
        <div className="goals-section">
          <Goals />
        </div>

      </div>
    </div>
  );
}

export default React.memo(Budgets);