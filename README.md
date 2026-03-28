📊 Finance Dashboard

A modern personal finance management web app built with React.
Track your income, expenses, budgets, and financial insights — all in one place.

🚀 Live Demo

👉 https://finance-dashboard1-gt.vercel.app

✨ Features
💰 Transaction Management
Add / edit / delete transactions
Categorized into income & expenses
Subcategory support
Payment method tracking
Monthly grouping with expandable view
📅 Monthly Reports
Income, expense, and savings summary
Savings rate calculation
Top spending categories
Highlights & insights
Transaction table per month
PDF export support
📊 Budget System
Category-based budget tracking
Circular ring visualization
Real-time spending vs limit
Inline editing for budgets
Smart insights & warnings
🎯 Goals Tracking
Add and manage savings goals
Track progress visually
🔔 Notification System
Budget exceeded alerts
Real-time notification panel
Read / unread handling
Auto-dismiss system
⚙️ Settings
Profile management (name, email, phone, company)
Theme toggle (Light / Dark)
Currency preference
Notification preferences
🎨 UI/UX Features
Responsive design
Dark mode support
Animated components
Clean dashboard layout
🧠 Data Handling
Current Storage System

The app uses:

localStorage + default data (code-based)
Behavior:
Scenario	Result
First visit	Loads default demo data
User adds data	Stored in localStorage
Refresh	Data persists
Different user/device	Gets fresh data
⚠️ Important Note
Data stored in localStorage is NOT shared across users
Each browser/device has its own data
Only default data (in code) is visible to everyone
🌐 Deployment

Deployed using Vercel

Steps followed:
Created GitHub repository
Uploaded project using Git
Connected repo to Vercel
Configured build settings
Deployed successfully 🚀
🔄 Data Migration (Local → Vercel)

To move local data to deployed app:

// Copy from local
copy(localStorage.getItem("financeData"))

// Paste into Vercel
localStorage.setItem("financeData", PASTE_HERE)
📁 Project Structure
src/
 ├── components/
 ├── context/
 │    └── FinanceContext.js
 │    └── NotificationContext.js
 ├── pages/
 │    ├── Dashboard
 │    ├── Transactions
 │    ├── Budgets
 │    ├── Reports
 │    ├── Settings
 ├── styles/
 └── App.js
🛠️ Tech Stack
React.js
Context API (State Management)
JavaScript (ES6+)
CSS (Custom styling)
jsPDF (PDF generation)
Vercel (Deployment)
⚡ Performance & Fixes Implemented
Fixed infinite re-render loops
Fixed maximum update depth error
Optimized useEffect dependencies
Removed state updates inside render
Implemented safe notification system
Prevented duplicate notifications
Improved data initialization logic
🚀 Future Enhancements
🔥 EVEN BETTER (NEXT LEVEL)

To make this a real production-ready app:

👉 Each user sees ONLY their own data

You need:

🔐 User Authentication (Login / Signup)
☁️ Backend / Cloud Storage (Firebase / Supabase / Node API)
📌 Planned Features
🔄 Firebase integration (real-time sync)
👤 User accounts & authentication
📤 Export (CSV & JSON)
🔔 Toast notifications (UI upgrade)
📈 Advanced analytics & charts
🌍 Multi-device data sync
🧾 Invoice / report generation
📱 PWA support (install as app)
🧪 How to Run Locally
npm install
npm start
🤝 Contributing

Feel free to fork and improve this project 🚀

📌 Author

Sai Tej

⭐ Final Note

This project evolved from a simple UI into a fully functional finance system with:

State management
Data persistence
Notifications
Reporting
Deployment

If you like this project, consider giving it a ⭐ on GitHub! 