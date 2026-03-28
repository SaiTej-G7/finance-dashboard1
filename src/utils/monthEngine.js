export const generateMonthlyData = (transactions) => {

const months = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

const currentMonthIndex = new Date().getMonth();

const visibleMonths = months.slice(0,currentMonthIndex+1);

return visibleMonths.map(month => {

const monthlyTransactions = transactions.filter(t =>
new Date(t.date)
.toLocaleString("default",{month:"short"}) === month
);

const income = monthlyTransactions
.filter(t => t.type === "income")
.reduce((sum,t)=>sum + Number(t.amount),0);

const expense = monthlyTransactions
.filter(t => t.type === "expense")
.reduce((sum,t)=>sum + Number(t.amount),0);

return {
month,
income,
expense,
balance: income-expense
};

});

};