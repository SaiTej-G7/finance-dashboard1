import { createContext, useContext, useReducer, useEffect } from "react";

const FinanceContext = createContext();

/* -----------------------------
CATEGORY STRUCTURE
------------------------------*/

const expenseCategories = [
  {
    name: "Food",
    subcategories: [
      "Groceries",
      "Restaurant",
      "Snacks",
      "Briyani",
      "Sweets",
      "Icecream",
    ],
  },
  {
    name: "Transport",
    subcategories: ["Fuel", "Parking", "Vehicle Service"],
  },
  {
    name: "Bills",
    subcategories: [
      "Electricity",
      "Water",
      "Internet",
      "Mobile",
      "Rent",
      "Subscriptions",
    ],
  },
  {
    name: "Shopping",
    subcategories: ["Clothing", "Electronics", "Accessories", "Home Items"],
  },
  {
    name: "Entertainment",
    subcategories: ["Movies", "Games", "Streaming", "Concerts"],
  },
  {
    name: "Health",
    subcategories: ["Medicine", "Doctor", "Insurance", "Gym"],
  },
  {
    name: "Education",
    subcategories: ["Books", "Courses", "Fees", "Stationery"],
  },
  {
    name: "Travel",
    subcategories: ["Flights", "Hotel", "Local Transport"],
  },
  {
    name: "Others",
    subcategories: ["Party", "Donations", "Family"],
  },
];

const incomeCategories = [
  { name: "Job", subcategories: ["Salary", "Bonus", "Overtime"] },
  { name: "Business", subcategories: ["Client Payment", "Commission"] },
  { name: "Investments", subcategories: ["Dividends", "Interest"] },
  { name: "Gifts", subcategories: ["Family", "Friends"] },
  { name: "Refunds", subcategories: ["Tax Refund", "Cashback"] },
  { name: "Other Income", subcategories: ["Misc"] },
];


/* -----------------------------
INITIAL STATE
------------------------------*/

const initialState = {
  transactions: [],
  expenseCategories,
  incomeCategories,
  budgets: [],
  goals: [],
};

/* -----------------------------
REDUCER
------------------------------*/

function financeReducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [
          { ...action.payload, id: Date.now().toString() },
          ...state.transactions,
        ],
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case "IMPORT_TRANSACTIONS":
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload],
      };

    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [
          ...state.budgets,
          { ...action.payload, id: Date.now().toString() },
        ],
      };

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b.category === action.payload.category
            ? { ...b, limit: action.payload.limit }
            : b,
        ),
      };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };

    case "ADD_GOAL":
      return {
        ...state,
        goals: [
          ...state.goals,
          { ...action.payload, id: Date.now().toString() },
        ],
      };

    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? action.payload : g,
        ),
      };

    default:
      return state;
  }
}

/* -----------------------------
PROVIDER
------------------------------*/

export function FinanceProvider({ children }) {
  const storedData = localStorage.getItem("financeData");

  const [state, dispatch] = useReducer(
    financeReducer,
    storedData ? JSON.parse(storedData) : initialState,
  );

  useEffect(() => {
    localStorage.setItem("financeData", JSON.stringify(state));
  }, [state]);

  /* ACTIONS */

  const addTransaction = (transaction) =>
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });

  const deleteTransaction = (id) =>
    dispatch({ type: "DELETE_TRANSACTION", payload: id });

  const updateTransaction = (transaction) =>
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });

  const addBudget = (budget) =>
    dispatch({ type: "ADD_BUDGET", payload: budget });

  const updateBudget = (budget) =>
    dispatch({ type: "UPDATE_BUDGET", payload: budget });

  const deleteBudget = (id) => dispatch({ type: "DELETE_BUDGET", payload: id });

  const addGoal = (goal) => dispatch({ type: "ADD_GOAL", payload: goal });

  const deleteGoal = (id) => dispatch({ type: "DELETE_GOAL", payload: id });

  const updateGoal = (goal) => dispatch({ type: "UPDATE_GOAL", payload: goal });

  /* -----------------------------
DERIVED FINANCIAL DATA
------------------------------*/

  const incomeTransactions = state.transactions.filter(
    (t) => t.type === "income",
  );
  const expenseTransactions = state.transactions.filter(
    (t) => t.type === "expense",
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0,
  );

  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + Number(t.amount),
    0,
  );

  const totalSavings = state.goals.reduce(
    (sum, g) => sum + Number(g.saved || 0),
    0,
  );

  const totalBalance = totalIncome - totalExpense - totalSavings;

  /* -----------------------------
CATEGORY SPENDING
------------------------------*/

  const categorySpending = {};

  state.transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = 0;
      }

      categorySpending[t.category] += Number(t.amount);
    });

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        expenseCategories: state.expenseCategories,
        incomeCategories: state.incomeCategories,

        budgets: state.budgets,
        goals: state.goals,
        dispatch,
        addTransaction,
        deleteTransaction,
        updateTransaction,

        addBudget,
        updateBudget,
        deleteBudget,

        addGoal,
        deleteGoal,
        updateGoal,

        categorySpending,

        totalIncome,
        totalExpense,
        totalSavings,
        totalBalance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
