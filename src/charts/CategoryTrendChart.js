import { useState } from "react";

import {
AreaChart,
Area,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer,
Legend
} from "recharts";

function CategoryTrendChart({ data = [], onSelectMonth }) {

const [hidden,setHidden] = useState({});

/* detect expense categories only */

const categories = Array.from(
new Set(
data.flatMap(m =>
Object.entries(m.categories || {})
.filter(([cat,value]) =>
value > 0 &&
!["Salary","Job","Investments","Business"].includes(cat)
)
.map(([cat]) => cat)
)
)
);

/* build dataset */

const chartData = data.map(m => {

const row = { month:m.month };

categories.forEach(cat=>{
row[cat] = m.categories?.[cat] || 0;
});

return row;

});

/* legend toggle */

const handleLegendClick = (o)=>{

setHidden(prev=>({
...prev,
[o.dataKey]: !prev[o.dataKey]
}));

};

const CustomTooltip = ({active,payload,label})=>{

if(active && payload && payload.length){

return(

<div className="tooltip">

<strong>{label}</strong>

{payload.map((p,i)=>(
<div key={i}>
{p.name}: ₹{p.value}
</div>
))}

</div>

);

}

return null;

};

return(

<div className="chart-card">

<div className="chart-header">
Category Trend Analysis
</div>

<div className="chart-divider"/>

<div className="chart-body">

<ResponsiveContainer width="100%" height="100%">

<AreaChart
data={chartData}
onClick={(e)=> e?.activeLabel && onSelectMonth?.(e.activeLabel)}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip content={<CustomTooltip/>}/>

<Legend onClick={handleLegendClick}/>

{categories.map((cat,i)=>{

if(hidden[cat]) return null;

return(

<Area
key={cat}
type="monotone"
dataKey={cat}
stackId="1"
stroke={`hsl(${i*40},70%,45%)`}
fill={`hsl(${i*40},70%,65%)`}
/>

);

})}

</AreaChart>

</ResponsiveContainer>

</div>

</div>

);

}

export default CategoryTrendChart;