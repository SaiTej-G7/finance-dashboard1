const months = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

let cachedHash = null;
let cachedResult = null;

export function generateAnalytics(transactions){

const hash = JSON.stringify(transactions);

if(hash === cachedHash){
return cachedResult;
}

/* monthly container */

const monthly = {};

const categoryTotals = {};

months.forEach(m=>{
monthly[m] = {
month:m,
income:0,
expense:0,
categories:{}
};
});

/* process transactions */

transactions.forEach(t=>{

const m = new Date(t.date)
.toLocaleString("default",{month:"short"});

if(!monthly[m]) return;

if(t.type==="income")
monthly[m].income += Number(t.amount);

if(t.type==="expense")
monthly[m].expense += Number(t.amount);

if(!monthly[m].categories[t.category])
monthly[m].categories[t.category] = 0;

monthly[m].categories[t.category] += Number(t.amount);

if(!categoryTotals[t.category])
categoryTotals[t.category] = 0;

categoryTotals[t.category] += Number(t.amount);

});

/* detect last month with data */

let lastMonthIndex = 0;

months.forEach((m,i)=>{
if(monthly[m].income>0 || monthly[m].expense>0){
lastMonthIndex = i;
}
});

/* keep only months with real data */

const activeMonths = months.slice(0,lastMonthIndex+1);

/* monthly trend */

const monthlyTrend = activeMonths.map(m=>{

const income = monthly[m].income;
const expense = monthly[m].expense;

return{
month:m,
income,
expense,
savings:income-expense,
categories:monthly[m].categories
};

});

/* savings trend */

let cumulative = 0;

const savingsTrend = monthlyTrend.map(m=>{

cumulative += m.savings;

return{
month:m.month,
savings:cumulative
};

});

/* forecast */

const expenses = monthlyTrend
.map(m=>m.expense)
.filter(v=>v>0);

const avg =
expenses.length
? expenses.reduce((a,b)=>a+b,0)/expenses.length
:0;

const forecast = Math.round(avg);

/* next month */

const nextMonth = months[lastMonthIndex+1] || null;

cachedHash = hash;

cachedResult = {
monthlyTrend,
savingsTrend,
forecast,
nextMonth,
categoryTotals
};

return cachedResult;

}

export function calculateFinancialScore(transactions = []) {

let income = 0;
let expense = 0;

transactions.forEach(t => {

if(t.type === "income") {
income += Number(t.amount);
}

if(t.type === "expense") {
expense += Number(t.amount);
}

});

if(income === 0) return 0;

/* savings rate */

const savings = income - expense;
const savingsRate = savings / income;

/* score calculations */

let score = 0;

/* savings contribution (40 pts) */

score += Math.max(0, Math.min(40, savingsRate * 40));

/* expense ratio (30 pts) */

const expenseRatio = expense / income;

score += Math.max(0, 30 - (expenseRatio * 30));

/* income stability (15 pts) */

score += income > expense ? 15 : 5;

/* spending discipline (15 pts) */

score += expenseRatio < 0.8 ? 15 : 5;

return Math.round(score);

}