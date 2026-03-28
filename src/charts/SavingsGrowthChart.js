import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
ReferenceLine
} from "recharts";

function SavingsGrowthChart({ data }) {

const goal = 10000;

return (

<div className="chart-card">

<div className="chart-header">
Savings Growth
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<AreaChart
data={data}
margin={{ top:20, right:20, left:0, bottom:20 }}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

{/* Goal threshold line */}

<ReferenceLine
y={goal}
stroke="#22c55e"
strokeDasharray="4 4"
label="Savings Goal"
/>

<Area
type="monotone"
dataKey="savings"
stroke="#22c55e"
fill="#86efac"
strokeWidth={3}
/>

</AreaChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default SavingsGrowthChart;