export function generateInsights(analytics, transactions = []){

const insights = [];

const months = analytics.monthlyTrend;

if(months.length < 2){
return [{
type:"info",
severity:"low",
priority:3,
title:"Not enough data",
message:"More transactions are needed to generate insights."
}];
}

const current = months[months.length-1];
const prev = months[months.length-2];

/* ---------- SPENDING TREND ---------- */

const diff = current.expense - prev.expense;

if(diff > 2000){

insights.push({
type:"warning",
severity:"critical",
priority:1,
title:"High Overspending",
message:`Spending increased significantly by ₹${diff}.`,
recommendation:`Reduce expenses by at least ₹${Math.round(diff*0.6)} next month.`
});

}else if(diff > 0){

insights.push({
type:"warning",
severity:"medium",
priority:2,
title:"Overspending Alert",
message:`Spending increased by ₹${diff}.`,
recommendation:`Try reducing discretionary expenses by ₹${Math.round(diff*0.4)}.`
});

}else if(diff < 0){

insights.push({
type:"positive",
severity:"low",
priority:3,
title:"Good Spending Control",
message:`You reduced spending by ₹${Math.abs(diff)}.`,
recommendation:"Continue this trend to increase savings."
});

}

/* ---------- SAVINGS ---------- */

if(current.savings < 0){

insights.push({
type:"warning",
severity:"critical",
priority:1,
title:"Negative Savings",
message:`Expenses exceeded income by ₹${Math.abs(current.savings)}.`,
recommendation:"Cut non-essential spending immediately or increase income."
});

}else if(current.savings > 0){

insights.push({
type:"positive",
severity:"low",
priority:3,
title:"Healthy Savings",
message:`You saved ₹${current.savings}.`,
recommendation:`Consider investing ₹${Math.round(current.savings*0.4)}.`
});

}

/* ---------- TOP CATEGORY ---------- */

let topCategory = "";
let topValue = 0;

Object.entries(current.categories || {}).forEach(([cat,val])=>{
if(val > topValue){
topValue = val;
topCategory = cat;
}
});

if(topCategory && topValue > 3000){

insights.push({
type:"tip",
severity:"medium",
priority:2,
title:"High Category Spending",
message:`${topCategory} spending is high (₹${topValue}).`,
recommendation:`Set a stricter budget for ${topCategory}.`
});

}

/* ---------- FORECAST ---------- */

if(analytics.forecast){

insights.push({
type:"info",
severity:"medium",
priority:2,
title:"Spending Forecast",
message:`Next month spending may reach ₹${analytics.forecast}.`,
recommendation:`Try keeping it below ₹${Math.round(analytics.forecast*0.9)}.`
});

}

/* ---------- WEEKEND SPENDING ---------- */

const weekend = transactions
.filter(t => t.type==="expense")
.filter(t => {
const d = new Date(t.date).getDay();
return d === 0 || d === 6;
})
.reduce((sum,t)=> sum + Number(t.amount),0);

const weekday = transactions
.filter(t => t.type==="expense")
.filter(t => {
const d = new Date(t.date).getDay();
return d !== 0 && d !== 6;
})
.reduce((sum,t)=> sum + Number(t.amount),0);

if(weekend > weekday){

insights.push({
type:"tip",
severity:"medium",
priority:2,
title:"Weekend Overspending",
message:"Weekend spending is higher than weekdays.",
recommendation:"Plan weekend budgets to avoid impulse purchases."
});

}

/* ---------- SORT BY PRIORITY ---------- */

insights.sort((a,b)=> a.priority - b.priority);

return insights;

}