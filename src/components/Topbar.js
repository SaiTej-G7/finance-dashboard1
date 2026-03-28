import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "../styles/topbar.css";
import { useNotifications } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";

function Topbar({ toggleSidebar }) {
  const { user, setUser } = useUser();
  const { notifications, markAsRead, clearAll } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef();

  /* ---------- THEME ---------- */
  useEffect(() => {
    document.body.classList.toggle("dark", user.theme === "dark");
  }, [user.theme]);

  const toggleTheme = () => {
    setUser({
      ...user,
      theme: user.theme === "dark" ? "light" : "dark",
    });
  };

  /* ---------- CLOSE ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---------- GREETING ---------- */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  /* ---------- TIME FORMAT ---------- */
  const getTimeAgo = (time) => {
    const diff = Math.floor((Date.now() - new Date(time)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";
    return Math.floor(diff / 86400) + " d ago";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="greeting">
          <h3>
            {getGreeting()}, {user.name || "User"}
          </h3>
          <span>Welcome back to your finance dashboard</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        {/* 🔔 NOTIFICATIONS */}
        <div className="notification-wrapper" ref={panelRef}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-header">
                <span>Notifications</span>
                <button onClick={clearAll}>Clear</button>
              </div>

              {notifications.length === 0 && (
                <p className="empty">No notifications</p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.type} ${
                    n.read ? "read" : ""
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="msg">{n.message}</div>
                  <div className="time">{getTimeAgo(n.time)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🌙 THEME */}
        <button className="icon-btn" onClick={toggleTheme}>
          {user.theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {/* 👤 PROFILE */}
        <div className="profile">
          <img src="https://i.pravatar.cc/40" alt="User" width="40" height="40" loading="lazy" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;