import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import "../styles/goals.css";

 function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [goalName, setGoalName] = useState("");
  const [goalLimit, setGoalLimit] = useState("");
  const [savedAmount, setSavedAmount] = useState("");

  /* OPEN ADD MODAL */

  const openAddModal = () => {
    setEditingGoal(null);
    setGoalName("");
    setGoalLimit("");
    setSavedAmount("");
    setShowModal(true);
  };

  /* OPEN EDIT MODAL */

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalLimit(goal.target);
    setSavedAmount(goal.saved);
    setShowModal(true);
  };

  /* SAVE GOAL */

  const handleSave = () => {
    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        target: Number(goalLimit),
        saved: Number(savedAmount),
        lastUpdated: new Date().toISOString(),
      });
    } else {
      addGoal({
        name: goalName,
        target: Number(goalLimit),
        saved: Number(savedAmount),
        lastUpdated: new Date().toISOString(),
      });
    }

    setShowModal(false);
  };

  /* PROGRESS */

  return (
    <div className="goals-card">
      <div className="goals-header">
        <h3>Savings Goals</h3>

        <button className="add-btn" onClick={openAddModal}>
          <Plus size={18} />
        </button>
      </div>

      {goals.map((goal) => {
        const percent = Math.min((goal.saved / goal.target) * 100, 100);

        return (
          <div key={goal.id} className="goal-item">
            <div className="goal-row">
              <span>{goal.name}</span>

              <div className="goal-actions">
                <span className="goal-amount">
                  ₹{goal.target}
                </span>

                <button
                  className="icon-btn"
                  onClick={() => openEditModal(goal)}
                >
                  <Pencil size={14} />
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="goal-slider">
              <div
                className={`goal-progress ${
                  goal.saved >= goal.target ? "goal-complete" : ""
                }`}
                style={{ width: `${percent}%` }}
              />

              <span className="goal-progress-label">₹{goal.saved}</span>
            </div>
          </div>
        );
      })}

      {/* MODAL */}

      {showModal && (
        <div className="goal-modal">
          <div className="goal-modal-content">
            <h4>{editingGoal ? "Edit Goal" : "Create Goal"}</h4>

            <input
              placeholder="Goal Name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              disabled={editingGoal}
            />

            <input
              type="number"
              placeholder="Goal Limit"
              value={goalLimit}
              onChange={(e) => setGoalLimit(e.target.value)}
            />

            <input
              type="number"
              placeholder="Saved Amount"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
            />

            <button className="save-btn" onClick={handleSave}>
              Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Goals;