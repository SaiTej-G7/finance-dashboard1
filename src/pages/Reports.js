import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { generateMonthlyReports } from "../utils/reportEngine";
import { generateMonthlyData } from "../utils/monthEngine";
import MonthlyReport from "../components/MonthlyReport";
import "../styles/reports.css";

function Reports() {

const { transactions } = useFinance();

/* base data */

const monthlyData = generateMonthlyData(transactions);
const reports = generateMonthlyReports(transactions);

/* merge */

const mergedReports = monthlyData.map(month => {

const report = reports.find(r => r.month === month.month);

return report
? report
: {
month: month.month,
income: 0,
expense: 0,
savings: 0,
transactions: 0,
categories: {}
};

});

/* selected */

const [selected,setSelected] = useState(null);

if(selected){
return(
<MonthlyReport
report={selected}
onBack={()=>setSelected(null)}
/>
);
}

/* helper: status */

const getStatus = (savings) => {

if(savings > 0) return { label:"Healthy", class:"status-good" };
if(savings === 0) return { label:"Neutral", class:"status-neutral" };
return { label:"Risk", class:"status-bad" };

};

/* helper: trend */

const getTrend = (current, prev) => {

if(prev === undefined) return "neutral";

if(current > prev) return "up";
if(current < prev) return "down";

return "neutral";

};

return(

<div className="reports-page">

<h1>Financial Reports</h1>

<div className="reports-list">

{mergedReports.map((r,i)=>{

const prev = mergedReports[i-1];

const status = getStatus(r.savings);
const trend = getTrend(r.savings, prev?.savings);

return(

<div
key={i}
className="report-row"
onClick={()=>setSelected(r)}
>

<span className="month">
{r.month}
</span>

<span className="income">
+₹{r.income}
</span>

<span className="expense">
-₹{r.expense}
</span>

<span className="savings">
₹{r.savings}
</span>

<span className={`trend trend-${trend}`} />

<span className={`status ${status.class}`}>
{status.label}
</span>

</div>

);

})}

</div>

</div>

);

}

export default Reports;