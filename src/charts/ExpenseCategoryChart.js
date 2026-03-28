import { useFinance } from "../context/FinanceContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ExpenseCategoryChart() {

  const { transactions } = useFinance();

  /* FILTER ONLY EXPENSES */

  const expenseTransactions = transactions.filter(
    (t) => t.type === "expense"
  );

  /* BUILD CATEGORY TOTALS */

  const categoryTotals = {};

  expenseTransactions.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }
    categoryTotals[t.category] += Number(t.amount);
  });

  /* CONVERT TO CHART DATA */

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  /* COLORS */

  const colors = [
      "#d56745",
     "#4c26f7",
    "#11b63f",
     "#eca922",
    "#ae1be8",
    "#ecdf1f",
     "#b4bfcb",
    "#eb1bb3",
    "#16ebe0",
  ];

  return (
    <div className="chart-card">

      <div className="chart-header">
        Expense Breakdown
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

export default ExpenseCategoryChart;