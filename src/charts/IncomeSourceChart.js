import { useFinance } from "../context/FinanceContext";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";

function IncomeSourceChart({ month }){

const { transactions = [], incomeCategories = [] } = useFinance();

/* FILTER MONTH */

const filtered =
month === "Total"
? transactions
: transactions.filter(t =>
new Date(t.date)
.toLocaleString("default",{month:"short"}) === month
);

/* CALCULATE INCOME TOTALS */

const incomeTotals = {};

filtered
.filter(t => t.type === "income")
.forEach(t => {

if(!incomeTotals[t.category]){
incomeTotals[t.category] = 0;
}

incomeTotals[t.category] += Number(t.amount);

});

/* BUILD DATA */

let data = incomeCategories.map(cat => ({
name: cat.name,
value: incomeTotals[cat.name] || 0
}));

/* REMOVE EMPTY */

data = data.filter(d => d.value > 0);

/* SORT */

data.sort((a,b) => b.value - a.value);

return(

<div className="chart-card">

<div className="chart-header">
Income Sources
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<BarChart
layout="vertical"
data={data}
margin={{top:20,right:20,left:40,bottom:10}}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis type="number"/>

<YAxis
type="category"
dataKey="name"
/>

<Tooltip/>

<Bar
dataKey="value"
fill="#22c55e"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

}

export default IncomeSourceChart;