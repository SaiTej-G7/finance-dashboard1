import { useFinance } from "../context/FinanceContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function IncomeChart() {

  const { transactions } = useFinance();

  /* FILTER ONLY INCOME */

  const incomeTransactions = transactions.filter(
    (t) => t.type === "income"
  );

  /* GROUP BY CATEGORY / SOURCE */

  const incomeTotals = {};

  incomeTransactions.forEach((t) => {
    if (!incomeTotals[t.category]) {
      incomeTotals[t.category] = 0;
    }
    incomeTotals[t.category] += Number(t.amount);
  });

  /* FORMAT */

  const data = Object.entries(incomeTotals).map(([name, value]) => ({
    name,
    value
  }));


  const colors = [
  "#cdf646",
    "#40c4dc",
  "#f59e0b", 
   "#22c55e", 
  "#ef4444",
   "#3b82f6",   
];

  return (
    <div className="chart-card">

      <div className="chart-header">
        Income Sources
      </div>

      <div className="chart-divider"/>

      <div className="chart-body">

        <ResponsiveContainer width="100%" height={250}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default IncomeChart;