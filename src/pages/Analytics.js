import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

import { generateAnalytics, calculateFinancialScore } from "../utils/analyticsEngine";
import { generateInsights } from "../utils/insightsEngine";

import FinancialScoreGauge from "../charts/FinancialScoreGauge";

import CategoryTrendChart from "../charts/CategoryTrendChart";
import SpendingForecastChart from "../charts/SpendingForecastChart";
import SavingsGrowthChart from "../charts/SavingsGrowthChart";
import AverageSpendingPattern from "../charts/AverageSpendingPattern";
import IncomeSourceChart from "../charts/IncomeSourceChart";
import BudgetVsActualChart from "../charts/BudgetVsActualChart";

import "../styles/analytics.css";

function Analytics(){

const { transactions = [] } = useFinance();

/* analytics */

const analytics = generateAnalytics(transactions);

/* AI insights */

const insights = generateInsights(analytics, transactions);

/* financial score */

const score = calculateFinancialScore(transactions);

/* month filter */

const [selectedMonth,setSelectedMonth] = useState("Total");

/* savings rate */

const income = transactions
.filter(t => t.type === "income")
.reduce((a,b)=>a + Number(b.amount),0);

const expense = transactions
.filter(t => t.type === "expense")
.reduce((a,b)=>a + Number(b.amount),0);

const savingsRate = income
? Math.round(((income-expense)/income)*100)
: 0;

return(

<div className="analytics-page">

{/* HEADER */}

<div className="analytics-header">

<h1 className="analytics-title">
Financial Analytics
</h1>

<select
value={selectedMonth}
onChange={(e)=>setSelectedMonth(e.target.value)}
>

<option value="Total">Select Month</option>
<option>Jan</option>
<option>Feb</option>
<option>Mar</option>
<option>Apr</option>
<option>May</option>
<option>Jun</option>
<option>Jul</option>
<option>Aug</option>
<option>Sep</option>
<option>Oct</option>
<option>Nov</option>
<option>Dec</option>

</select>

</div>


{/* SCORE + INSIGHTS */}

<div className="analytics-grid-1">

<FinancialScoreGauge
score={score}
savingsRate={savingsRate}
/>

<div className="analytics-card">

<h3>AI Insights</h3>

<div className="insights-container">

{insights.map((i,index)=>{

const icons = {
positive:"📈",
warning:"⚠",
tip:"💡",
info:"🎯"
};

const severityColors = {
critical:"insight-critical",
medium:"insight-warning",
low:"insight-good"
};

return(

<div
key={index}
className={`insight ${severityColors[i.severity]}`}
>

<div className="insight-title">
{icons[i.type]} {i.title}
</div>

<div className="insight-message">
{i.message}
</div>

{i.recommendation && (
<div className="insight-recommendation">
👉 {i.recommendation}
</div>
)}

</div>

);

})}

</div>

</div>
</div>


{/* CATEGORY TREND */}

<CategoryTrendChart
data={analytics.monthlyTrend}
/>


{/* FORECAST + SAVINGS */}

<div className="analytics-grid-2">

<SpendingForecastChart
data={analytics.monthlyTrend}
forecast={analytics.forecast}
nextMonth={analytics.nextMonth}
/>

<SavingsGrowthChart
data={analytics.savingsTrend}
/>

</div>


{/* DAILY + INCOME */}

<div className="analytics-grid-2">

<AverageSpendingPattern
month={selectedMonth}
/>

<IncomeSourceChart
month={selectedMonth}
/>

</div>


{/* BUDGET */}

<BudgetVsActualChart
month={selectedMonth}
/>

</div>

);

}

export default Analytics;