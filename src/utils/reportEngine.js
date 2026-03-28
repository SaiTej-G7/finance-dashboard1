export const generateMonthlyReports = (transactions) => {

const reports = {};

transactions.forEach(t => {

const date = new Date(t.date);

const month = date.toLocaleString("default",{month:"short"});
const year = date.getFullYear();

const key = `${month}-${year}`;

if(!reports[key]){
reports[key] = {
month,
year,
income:0,
expense:0,
transactions:0,
categories:{}
};
}

reports[key].transactions++;

if(t.type === "income"){
reports[key].income += Number(t.amount);
}else{
reports[key].expense += Number(t.amount);
}

/* category totals */

if(!reports[key].categories[t.category]){
reports[key].categories[t.category] = 0;
}

reports[key].categories[t.category] += Number(t.amount);

});

return Object.values(reports).map(r => ({
...r,
savings: r.income - r.expense
}));

};