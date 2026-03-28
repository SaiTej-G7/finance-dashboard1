import { useEffect, useState } from "react";

function FinancialScoreGauge({ score = 0, savingsRate = 0 }) {

const [value,setValue] = useState(0);

useEffect(()=>{

let start = 0;

const timer = setInterval(()=>{

start += 1;

if(start >= score){
start = score;
clearInterval(timer);
}

setValue(start);

},10);

return ()=>clearInterval(timer);

},[score]);

/* convert score → needle angle */

const angle = -90 + (value/100)*180;

/* correct ticks */

const ticks = [0,20,40,60,80,100];

return(

<div className="analytics-card score-card">

<h4>Financial Score: {score}  </h4>
<span>  Savings Rate: {savingsRate}% </span>

<svg width="260" height="190">

{/* HEALTH INDICATOR RING */}

<circle
cx="130"
cy="135"
r="110"
stroke="#22c55e"
strokeWidth="3"
fill="none"
className={savingsRate > 20 ? "pulse-ring" : ""}
/>

{/* GRADIENT ARC */}

<defs>
<linearGradient id="scoreGradient">
<stop offset="0%" stopColor="#ef4444"/>
<stop offset="50%" stopColor="#f59e0b"/>
<stop offset="100%" stopColor="#22c55e"/>
</linearGradient>
</defs>

<path
d="M30 140 A100 100 0 0 1 230 140"
stroke="url(#scoreGradient)"
strokeWidth="18"
fill="none"
/>

{/* TICKS */}

{ticks.map((t)=>{

const a = (-145 + (t/100)*180) * Math.PI/180;

const x1 = 130 + Math.cos(a)*85;
const y1 = 140 + Math.sin(a)*85;

const x2 = 130 + Math.cos(a)*100;
const y2 = 140 + Math.sin(a)*100;

const lx = 130 + Math.cos(a)*115;
const ly = 140 + Math.sin(a)*115;

return(

<g key={t}>

<line
x1={x1}
y1={y1}
x2={x2}
y2={y2}
stroke="#6b7280"
strokeWidth="2"
/>

<text
x={lx}
y={ly}
fontSize="14"
textAnchor="middle"
alignmentBaseline="middle"
fill="#6b7280"
>
{t}
</text>

</g>

)

})}

{/* NEEDLE */}

<g
style={{
transform:`rotate(${angle}deg)`,
transformOrigin:"130px 140px",
transition:"transform 0.6s ease"
}}
>

<line
x1="130"
y1="140"
x2="130"
y2="55"
stroke="#111827"
strokeWidth="4"
/>

</g>

{/* NEEDLE CENTER */}

<circle
cx="130"
cy="140"
r="7"
fill="#111827"
/>

{/* SCORE TEXT (MOVED UP)

<text
x="130"
y="115"
textAnchor="middle"
fontSize="34"
fontWeight="700"
>
{value}
</text>

{/* SAVINGS RATE */}
{/* 
<text
x="130"
y="155"
textAnchor="middle"
fontSize="14"
fill="#6b7280"
>
Savings Rate {savingsRate}%
</text>  */}

</svg>

</div>

)

}

export default FinancialScoreGauge;