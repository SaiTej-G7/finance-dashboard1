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

function AverageSpendingPattern({ month }){

const { transactions = [] } = useFinance();

/* FILTER MONTH */

const filtered =
month === "Total"
? transactions
: transactions.filter(t =>
new Date(t.date)
.toLocaleString("default",{month:"short"}) === month
);

/* DAYS */

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const daily = {};

days.forEach(d => {
daily[d] = { total:0,count:0 };
});

/* CALCULATE */

filtered
.filter(t => t.type === "expense")
.forEach(t => {

const d = new Date(t.date)
.toLocaleString("default",{weekday:"short"});

if(!daily[d]) return;

daily[d].total += Number(t.amount);
daily[d].count += 1;

});

/* BUILD DATA */

const data = days.map(d => ({
day: d,
value: daily[d].count
? Math.round(daily[d].total / daily[d].count)
: 0
}));

return(

<div className="chart-card">

<div className="chart-header">
Average Spending Pattern
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<BarChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="day"/>

<YAxis/>

<Tooltip/>

<Bar
dataKey="value"
fill="#6366f1"
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)

}

export default AverageSpendingPattern;