import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [user, setUser] = useState(() => ({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || "",
    company: localStorage.getItem("userCompany") || "",
    theme: localStorage.getItem("theme") || "light",
    currency: localStorage.getItem("currency") || "INR",
    settings: {
      budgetAlert: JSON.parse(localStorage.getItem("budgetAlert") || "true"),
      largeTxnAlert: JSON.parse(localStorage.getItem("largeTxnAlert") || "true"),
      recurringAlert: JSON.parse(localStorage.getItem("recurringAlert") || "true"),
      weeklyReport: JSON.parse(localStorage.getItem("weeklyReport") || "true"),
      unusualAlert: JSON.parse(localStorage.getItem("unusualAlert") || "true"),
    }
  }));

  /* 🔥 Persist to localStorage (ONLY ONE EFFECT) */
  useEffect(() => {
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhone", user.phone);
    localStorage.setItem("userCompany", user.company);
    localStorage.setItem("theme", user.theme);
    localStorage.setItem("currency", user.currency);

    Object.entries(user.settings).forEach(([key, val]) => {
      localStorage.setItem(key, JSON.stringify(val));
    });

  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);