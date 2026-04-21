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

const defaultData = {
  transactions: [
    [
      {
        id: "1773811124626",
        amount: "1000",
        type: "income",
        category: "Other Income",
        subcategory: "Misc",
        date: "2026-03-30",
        paymentMethod: "Cash",
      },
      {
        id: "1773811087129",
        amount: "2000",
        type: "income",
        category: "Refunds",
        subcategory: "Tax Refund",
        date: "2026-03-23",
        paymentMethod: "UPI",
      },
      {
        id: "1773462611636",
        amount: "1000",
        type: "expense",
        category: "Education",
        subcategory: "Books",
        date: "2026-03-15",
        paymentMethod: "Cash",
      },
      {
        id: "1773414536744",
        amount: "3000",
        type: "expense",
        category: "Food",
        subcategory: "Restaurant",
        date: "2026-03-31",
        paymentMethod: "Cash",
      },
      {
        id: "1773414363067",
        amount: "2400",
        type: "expense",
        category: "Others",
        subcategory: "Misc",
        date: "2026-03-31",
        paymentMethod: "UPI",
      },
      {
        id: "1773414314579",
        amount: "3000",
        type: "income",
        category: "Gifts",
        subcategory: "Family",
        date: "2026-03-30",
        paymentMethod: "Cash",
      },
      {
        id: "1773414288964",
        amount: "3600",
        type: "expense",
        category: "Shopping",
        subcategory: "Accessories",
        date: "2026-03-29",
        paymentMethod: "UPI",
      },
      {
        id: "1773414239797",
        amount: "2000",
        type: "expense",
        category: "Travel",
        subcategory: "Hotel",
        date: "2026-03-27",
        paymentMethod: "Cash",
      },
      {
        id: "1773414200429",
        amount: "5000",
        type: "expense",
        category: "Health",
        subcategory: "Insurance",
        date: "2026-03-25",
        paymentMethod: "UPI",
      },
      {
        id: "1773414159483",
        amount: "3000",
        type: "expense",
        category: "Shopping",
        subcategory: "Clothing",
        date: "2026-03-20",
        paymentMethod: "Cash",
      },
      {
        id: "1773414130314",
        amount: "500",
        type: "expense",
        category: "Transport",
        subcategory: "Fuel",
        date: "2026-03-14",
        paymentMethod: "Cash",
      },
      {
        id: "1773414093701",
        amount: "800",
        type: "expense",
        category: "Bills",
        subcategory: "Internet",
        date: "2026-03-10",
        paymentMethod: "UPI",
      },
      {
        id: "1773414056553",
        amount: "1000",
        type: "expense",
        category: "Entertainment",
        subcategory: "Movies",
        date: "2026-03-13",
        paymentMethod: "Cash",
      },
      {
        id: "1773414002297",
        amount: "900",
        type: "expense",
        category: "Bills",
        subcategory: "Electricity",
        date: "2026-03-10",
        paymentMethod: "UPI",
      },
      {
        id: "1773413954748",
        amount: "8000",
        type: "expense",
        category: "Bills",
        subcategory: "Rent",
        date: "2026-03-05",
        paymentMethod: "UPI",
      },
      {
        id: "1773413913399",
        amount: "40000",
        type: "income",
        category: "Salary",
        subcategory: "Salary",
        date: "2026-03-01",
        paymentMethod: "UPI",
      },
      {
        id: 1773625639918.418,
        amount: 5200,
        type: "income",
        category: "Salary",
        subcategory: "Salary",
        date: "2026-02-03",
        paymentMethod: "Cash",
      },
      {
        id: 1773625639918.7908,
        date: "2026-02-04",
        type: "expense",
        category: "Food",
        amount: 220,
        description: "Restaurant lunch\r",
      },
      {
        id: 1773625639918.5486,
        date: "2026-02-05",
        type: "expense",
        category: "Shopping",
        amount: 350,
        description: "Clothing purchase\r",
      },
      {
        id: 1773625639918.0674,
        date: "2026-02-06",
        type: "expense",
        category: "Bills",
        amount: 400,
        description: "Electricity bill\r",
      },
      {
        id: 1773625639918.6982,
        date: "2026-02-08",
        type: "expense",
        category: "Food",
        amount: 200,
        description: "Groceries\r",
      },
      {
        id: 1773625639918.013,
        date: "2026-02-10",
        type: "income",
        category: "Investments",
        amount: 900,
        description: "Stock dividend\r",
      },
      {
        id: 1773625639918.8845,
        date: "2026-02-12",
        type: "expense",
        category: "Food",
        amount: 210,
        description: "Supermarket\r",
      },
      {
        id: 1773625639918.4077,
        date: "2026-02-13",
        type: "expense",
        category: "Shopping",
        amount: 300,
        description: "Online shopping\r",
      },
      {
        id: 1773625639918.8093,
        date: "2026-02-14",
        type: "expense",
        category: "Entertainment",
        amount: 180,
        description: "Valentine dinner\r",
      },
      {
        id: 1773625639918.816,
        date: "2026-02-16",
        type: "expense",
        category: "Bills",
        amount: 350,
        description: "Internet bill\r",
      },
      {
        id: 1773625639918.23,
        date: "2026-02-17",
        type: "expense",
        category: "Food",
        amount: 190,
        description: "Grocery refill\r",
      },
      {
        id: 1773625639918.441,
        date: "2026-02-18",
        type: "expense",
        category: "Education",
        amount: 250,
        description: "Online course\r",
      },
      {
        id: 1773625639918.715,
        date: "2026-02-20",
        type: "income",
        category: "Business",
        amount: 1200,
        description: "Freelance project\r",
      },
      {
        id: 1773625639918.7007,
        date: "2026-02-21",
        type: "expense",
        category: "Food",
        amount: 210,
        description: "Dinner outside\r",
      },
      {
        id: 1773625639918.6514,
        date: "2026-02-22",
        type: "expense",
        category: "Shopping",
        amount: 280,
        description: "Accessories\r",
      },
      {
        id: 1773625639918.1594,
        date: "2026-02-24",
        type: "expense",
        category: "Entertainment",
        amount: 160,
        description: "Streaming subscription\r",
      },
      {
        id: 1773625639918.1958,
        date: "2026-02-26",
        type: "expense",
        category: "Bills",
        amount: 420,
        description: "Water bill\r",
      },
      {
        id: 1773625639918.1533,
        date: "2026-02-27",
        type: "expense",
        category: "Food",
        amount: 230,
        description: "Groceries\r",
      },
      {
        id: 1776780215859.499,
        date: "2026-04-01",
        type: "income",
        category: "Salary",
        amount: 35000,
        description: "Monthly salary credit\r",
      },
      {
        id: 1776780215859.3333,
        date: "2026-04-03",
        type: "expense",
        category: "Food",
        amount: 2200,
        description: "Grocery and vegetables\r",
      },
      {
        id: 1776780215859.0144,
        date: "2026-04-05",
        type: "expense",
        category: "Transport",
        amount: 1800,
        description: "Fuel and cab charges\r",
      },
      {
        id: 1776780215859.335,
        date: "2026-04-07",
        type: "income",
        category: "Investment",
        amount: 12000,
        description: "Mutual fund returns\r",
      },
      {
        id: 1776780215859.389,
        date: "2026-04-08",
        type: "expense",
        category: "Bills",
        amount: 9500,
        description: "House rent and electricity bill\r",
      },
      {
        id: 1776780215859.797,
        date: "2026-04-10",
        type: "expense",
        category: "Entertainment",
        amount: 2500,
        description: "Movie and weekend outing\r",
      },
      {
        id: 1776780215859.7744,
        date: "2026-04-12",
        type: "expense",
        category: "Shopping",
        amount: 4200,
        description: "Clothes and accessories\r",
      },
      {
        id: 1776780215859.9614,
        date: "2026-04-14",
        type: "expense",
        category: "Health",
        amount: 3000,
        description: "Medical checkup and medicines\r",
      },
      {
        id: 1776780215859.2842,
        date: "2026-04-16",
        type: "income",
        category: "Business",
        amount: 13000,
        description: "Freelance project income\r",
      },
      {
        id: 1776780215859.4998,
        date: "2026-04-18",
        type: "expense",
        category: "Education",
        amount: 3500,
        description: "Online course subscription\r",
      },
      {
        id: 1776780215859.915,
        date: "2026-04-20",
        type: "expense",
        category: "Travel",
        amount: 4800,
        description: "Weekend trip expenses\r",
      },
      {
        id: 1776780215859.507,
        date: "2026-04-22",
        type: "expense",
        category: "Bills",
        amount: 11000,
        description: "EMI and internet payment\r",
      },
      {
        id: 1776780215859.097,
        date: "2026-04-24",
        type: "expense",
        category: "Food",
        amount: 2600,
        description: "Restaurant and dining\r",
      },
      {
        id: 1776780215859.0837,
        date: "2026-04-27",
        type: "expense",
        category: "Transport",
        amount: 2100,
        description: "Vehicle service and fuel\r",
      },
      {
        id: 1776780215859.6416,
        date: "2026-04-29",
        type: "expense",
        category: "Bills",
        amount: 5800,
        description: "Water bill and maintenance\r",
      },
      {
        id: 1776780226294.5886,
        date: "2026-05-02",
        type: "income",
        category: "Salary",
        amount: 36000,
        description: "Monthly salary credit\r",
      },
      {
        id: 1776780226294.3281,
        date: "2026-05-04",
        type: "expense",
        category: "Food",
        amount: 2500,
        description: "Grocery and supermarket shopping\r",
      },
      {
        id: 1776780226294.4663,
        date: "2026-05-06",
        type: "expense",
        category: "Transport",
        amount: 2200,
        description: "Fuel and local travel expenses\r",
      },
      {
        id: 1776780226294.4153,
        date: "2026-05-08",
        type: "income",
        category: "Investment",
        amount: 11000,
        description: "Stock and mutual fund returns\r",
      },
      {
        id: 1776780226294.8855,
        date: "2026-05-09",
        type: "expense",
        category: "Bills",
        amount: 12000,
        description: "House rent and electricity charges\r",
      },
      {
        id: 1776780226294.5613,
        date: "2026-05-11",
        type: "expense",
        category: "Entertainment",
        amount: 3000,
        description: "Movies and weekend dining\r",
      },
      {
        id: 1776780226294.31,
        date: "2026-05-13",
        type: "expense",
        category: "Shopping",
        amount: 5000,
        description: "Clothing and accessories purchase\r",
      },
      {
        id: 1776780226294.2317,
        date: "2026-05-15",
        type: "expense",
        category: "Health",
        amount: 3500,
        description: "Doctor consultation and medicines\r",
      },
      {
        id: 1776780226294.5103,
        date: "2026-05-17",
        type: "income",
        category: "Business",
        amount: 13000,
        description: "Freelance business payment\r",
      },
      {
        id: 1776780226294.1172,
        date: "2026-05-19",
        type: "expense",
        category: "Education",
        amount: 4000,
        description: "Course fee and books\r",
      },
      {
        id: 1776780226294.071,
        date: "2026-05-21",
        type: "expense",
        category: "Travel",
        amount: 5500,
        description: "Outstation travel expenses\r",
      },
      {
        id: 1776780226294.262,
        date: "2026-05-23",
        type: "expense",
        category: "Bills",
        amount: 9000,
        description: "EMI and internet recharge\r",
      },
      {
        id: 1776780226294.7922,
        date: "2026-05-25",
        type: "expense",
        category: "Food",
        amount: 2800,
        description: "Restaurant and food delivery\r",
      },
      {
        id: 1776780226294.389,
        date: "2026-05-27",
        type: "expense",
        category: "Transport",
        amount: 2500,
        description: "Vehicle maintenance and fuel\r",
      },
      {
        id: 1776780226294.2163,
        date: "2026-05-30",
        type: "expense",
        category: "Bills",
        amount: 5000,
        description: "Water bill and maintenance charges\r",
      },
    ],
  ],
  budgets: [
    [
      {
        id: "1773422107845",
        category: "Food",
        limit: 6000,
      },
      {
        id: "1773422140809",
        category: "Transport",
        limit: 5000,
      },
      {
        id: "1773422180023",
        category: "Bills",
        limit: 30000,
      },
      {
        id: "1773422210006",
        category: "Shopping",
        limit: 10000,
      },
      {
        id: "1773424707788",
        category: "Travel",
        limit: 6000,
      },
      {
        id: "1773424802566",
        category: "Education",
        limit: 5000,
      },
      {
        id: "1773425095282",
        category: "Others",
        limit: 3000,
      },
      {
        id: "1773425107746",
        category: "Others",
        limit: 3000,
      },
      {
        id: "1773462639480",
        category: "Education",
        limit: 5000,
      },
      {
        id: "1773462802236",
        category: "Entertainment",
        limit: 3500,
      },
      {
        id: "1773462859505",
        category: "Others",
        limit: 3000,
      },
      {
        id: "1773464871797",
        category: "Travel",
        limit: 6000,
      },
      {
        id: "1773464945517",
        category: "Others",
        limit: 3000,
      },
      {
        category: "Health",
        limit: 6000,
        id: "1773466534449",
      },
    ],
  ],
  goals: [
    [
      {
        name: "Buy a Bike",
        target: 30000,
        saved: 5000,
        lastUpdated: "2026-04-21T14:11:00.098Z",
        id: "1773839786434",
      },
      {
        name: "Emergency ",
        target: 10000,
        saved: 2000,
        lastUpdated: "2026-04-21T14:11:18.873Z",
        id: "1773847292423",
      },
    ],
  ],
};
/* -----------------------------
INITIAL STATE
------------------------------*/

const initialState = {
  transactions: defaultData.transactions,
  expenseCategories,
  incomeCategories,
  budgets: defaultData.budgets,
  goals: defaultData.goals,
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
      const merged = [...state.transactions, ...action.payload];

      const unique = merged.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id),
      );

      return {
        ...state,
        transactions: unique,
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
  const parsedData = storedData ? JSON.parse(storedData) : null;
  const [state, dispatch] = useReducer(
    financeReducer,
    parsedData && parsedData.transactions?.length > 0
      ? parsedData
      : initialState,
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
