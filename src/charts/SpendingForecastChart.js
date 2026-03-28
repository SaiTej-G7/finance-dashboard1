import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Legend
} from "recharts";

function SpendingForecastChart({data=[],forecast,nextMonth}){

const chartData = [...data];

if(nextMonth){

chartData.push({
month:nextMonth,
expense:null,
forecast
});

}

return(

<div className="chart-card">

<div className="chart-header">
Spending Forecast
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={chartData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Line
type="monotone"
dataKey="expense"
stroke="#ef4444"
strokeWidth={3}
name="Actual"
/>

<Line
type="monotone"
dataKey="forecast"
stroke="#3b82f6"
strokeDasharray="5 5"
strokeWidth={3}
name="Forecast"
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default SpendingForecastChart;