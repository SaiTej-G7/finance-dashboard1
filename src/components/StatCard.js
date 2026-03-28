import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "../styles/statcard.css";

function StatCard({ title, amount, change = "+0%", data = [] }) {
  const isPositive = change.startsWith("+");

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [data]);

  /* ZIGZAG DATA */
  const createZigzag = (arr) => {
    if (!arr || arr.length < 2) return [0, 0];

    const result = [];

    for (let i = 0; i < arr.length - 1; i++) {
      const start = arr[i];
      const end = arr[i + 1];

      result.push(start);

      const diff = end - start;

      const midUp = start + diff * 0.4 + Math.abs(diff) * 0.2;
      const midDown = start + diff * 0.7 - Math.abs(diff) * 0.2;

      result.push(midUp);
      result.push(midDown);
    }

    result.push(arr[arr.length - 1]);
    return result;
  };

  const sparkData = createZigzag(data);

  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-title">{title}</span>

        <div className={`stat-change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          {change}
        </div>
      </div>

      <div className="stat-amount">{amount}</div>

      {/* ANIMATED SPARKLINE */}
      <div className="mini-chart">
        <Sparklines data={sparkData} width={100} height={25}>
          <SparklinesLine
            color={lineColor}
            style={{
              strokeWidth: 1.5,
              fill: "none",
              strokeDasharray: 200,
              strokeDashoffset: animate ? 0 : 200,
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          />
        </Sparklines>
      </div>
    </div>
  );
}

export default StatCard;