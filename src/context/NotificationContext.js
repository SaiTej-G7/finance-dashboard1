import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications")) || [];
  });

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  /* ADD NOTIFICATION */
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      time: new Date().toISOString()
    };

    setNotifications((prev) => [newNotification, ...prev]);

    /* AUTO REMOVE AFTER 5 SEC */
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  /* REMOVE */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  /* MARK AS READ */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  /* CLEAR ALL */
  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);