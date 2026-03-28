import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { FinanceProvider } from "./context/FinanceContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import ToastContainer from "./components/ToastContainer";
/* Global Styles */
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <FinanceProvider>
      <UserProvider>
        <NotificationProvider>
           <ToastContainer />
          <App />
        </NotificationProvider>
      </UserProvider>
    </FinanceProvider>
  </React.StrictMode>,
);
