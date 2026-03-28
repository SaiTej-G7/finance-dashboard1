import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";

function SpendingChart({ data }){

return(

<div className="chart-card">

<div className="chart-header">
Monthly Spending
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="expense"
stroke="#ef4444"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

)

}

export default SpendingChart;