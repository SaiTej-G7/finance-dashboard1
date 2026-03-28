import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";

import "../styles/transactions.css";

function Transactions() {
  const { transactions, expenseCategories, incomeCategories , dispatch } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [importMessage, setImportMessage] = useState("");
  /* COMBINE ALL CATEGORIES */

  const allCategories = [...expenseCategories, ...incomeCategories];

  /* FILTER LOGIC */

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.subcategory?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || t.category === categoryFilter;

    const matchesType = typeFilter === "" || t.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  /* OPEN ADD MODAL */

  const handleAddTransaction = () => {
    setEditData(null);
    setShowModal(true);
  };

  /* OPEN EDIT MODAL */

  const handleEditTransaction = (transaction) => {
    setEditData(transaction);
    setShowModal(true);
  };

  /* CLOSE MODAL */

  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  // import transaction as .csv

  const handleImport = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const text = await file.text();

    const rows = text
      .split("\n")
      .slice(1)
      .filter((row) => row.trim() !== "");

    const imported = rows.map((row) => {
      const [date, type, category, amount, description] = row.split(",");

      return {
        id: Date.now() + Math.random(),
        date,
        type,
        category,
        amount: Number(amount),
        description,
      };
    });

    dispatch({
      type: "IMPORT_TRANSACTIONS",
      payload: imported,
    });

    setImportMessage(`Transactions file imported successfully`);

    setTimeout(() => {
      setImportMessage("");
    }, 3000);
  };

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>

      {/* FILTER BAR */}

      <div className="transaction-filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>

          {allCategories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

          {importMessage && (<div className="import-success">{importMessage}</div>)}

        <input type="file" accept=".csv" onChange={handleImport}  />

        <button className="add-btn" onClick={handleAddTransaction}>
          + Add Transaction
        </button>
      </div>

      {/* TRANSACTION TABLE */}

      <TransactionTable
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
      />

      {/* MODAL */}

      {showModal && (
        <TransactionModal closeModal={closeModal} editData={editData} />
      )}
    </div>
  );
}

export default Transactions;
