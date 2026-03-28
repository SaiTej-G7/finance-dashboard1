import { useFinance } from "../context/FinanceContext";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
Legend,
ResponsiveContainer,
CartesianGrid
} from "recharts";

function BudgetVsActualChart({ month }){

const {
transactions = [],
budgets = [],
expenseCategories = []
} = useFinance();

/* FILTER TRANSACTIONS BY MONTH */

const filtered =
month === "Total"
? transactions
: transactions.filter(t =>
new Date(t.date)
.toLocaleString("default",{month:"short"}) === month
);

/* CALCULATE ACTUAL SPENDING */

const categoryTotals = {};

filtered
.filter(t => t.type === "expense")
.forEach(t => {

if(!categoryTotals[t.category]){
categoryTotals[t.category] = 0;
}

categoryTotals[t.category] += Number(t.amount);

});

/* BUILD DATASET */

let data = expenseCategories.map(cat => {

const name = cat.name;

const budget = budgets.find(b => b.category === name);

return {

category: name,

budget: budget ? Number(budget.limit) : 0,

actual: categoryTotals[name] || 0

};

});

/* REMOVE EMPTY */

data = data.filter(d => d.budget > 0 || d.actual > 0);

/* SORT */

data.sort((a,b) => b.actual - a.actual);

return(

<div className="chart-card">

<div className="chart-header">
Budget vs Actual
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<BarChart
data={data}
margin={{top:5,right:10,left:0,bottom:25}}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis
dataKey="category"
interval={0}
angle={-20}
textAnchor="end"
/>

<YAxis/>

<Tooltip/>

<Legend verticalAlign="top" height={36}/>

<Bar
dataKey="budget"
fill="#3b82f6"
name="Budget Limit"
/>

<Bar
dataKey="actual"
fill="#ef4444"
name="Actual Spending"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default BudgetVsActualChart;