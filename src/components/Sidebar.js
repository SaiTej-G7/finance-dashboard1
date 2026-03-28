import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaChartPie,
  FaExchangeAlt,
  FaWallet,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaBars
} from "react-icons/fa";

import "../styles/sidebar.css";

const menu = [
  { name: "Dashboard", icon: <FaChartPie />, path: "/" },
  { name: "Transactions", icon: <FaExchangeAlt />, path: "/transactions" },
  { name: "Budgets", icon: <FaWallet />, path: "/budgets" },
  { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },

  { name: "Reports", icon: <FaFileAlt />, path: "/reports" },
  { name: "Settings", icon: <FaCog />, path: "/settings" }
];

function Sidebar({open}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    
        <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${open ? "open" : ""}`}>
      {/* Top Brand + Toggle */}
      <div className="sidebar-header">
        {!collapsed && <h2 className="logo">FinancePro</h2>}

        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="menu">

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="icon">{item.icon}</span>

            {!collapsed && <span className="label">{item.name}</span>}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;