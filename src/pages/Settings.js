import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "../styles/settings.css";
import { useUser } from "../context/UserContext";

function Settings() {
  const { user, setUser } = useUser();

  const [saved, setSaved] = useState(false);

  /* ---------- SAVE PROFILE ---------- */

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ---------- UPDATE HELPERS ---------- */

  const updateField = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const updateSetting = (key) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        [key]: !user.settings[key],
      },
    });
  };

  const toggleTheme = (mode) => {
    setUser({ ...user, theme: mode });
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-layout">
        {/* PROFILE */}
        <div className="settings-card profile-card">
          <div className="profile-header">
            <div className="avatar">
              <img src="https://i.pravatar.cc/100" alt="profile" width="40" height="40" loading="lazy" />
              <span className="edit-avatar">✎</span>
            </div>

            <h3>{user.name || "Your Name"}</h3>
            <p className="subtitle">{user.email || "your@email.com"}</p>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              value={user.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={user.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              value={user.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <input
              value={user.company}
              onChange={(e) => updateField("company", e.target.value)}
            />
          </div>

          <button className="save-btn" onClick={saveProfile}>
            {saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="right-column">
          {/* APPEARANCE */}
          <div className="settings-card">
            <h3>Appearance</h3>

            <div className="theme-options">
              <div
                className={`theme-card ${
                  user.theme === "light" ? "active light-active" : ""
                }`}
                onClick={() => toggleTheme("light")}
              >
                <FaSun />
                <span>Light</span>
              </div>

              <div
                className={`theme-card ${
                  user.theme === "dark" ? "active dark-active" : ""
                }`}
                onClick={() => toggleTheme("dark")}
              >
                <FaMoon />
                <span>Dark</span>
              </div>
            </div>
          </div>

          {/* CURRENCY */}
          <div className="settings-card">
            <h3>Currency</h3>

            <select
              className="modern-select"
              value={user.currency}
              onChange={(e) => updateField("currency", e.target.value)}
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>

          {/* NOTIFICATIONS */}
          <div className="settings-card">
            <h3>Notifications</h3>

            <div className="toggle-row">
              <span>Budget Alerts</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.settings.budgetAlert}
                  onChange={() => updateSetting("budgetAlert")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <span>Large Transactions</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.settings.largeTxnAlert}
                  onChange={() => updateSetting("largeTxnAlert")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <span>Recurring payments</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.settings.recurringAlert}
                  onChange={() => updateSetting("recurringAlert")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <span>Weekly summary</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.settings.weeklyReport}
                  onChange={() => updateSetting("weeklyReport")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <span>Unusual spending</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.settings.unusualAlert}
                  onChange={() => updateSetting("unusualAlert")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;