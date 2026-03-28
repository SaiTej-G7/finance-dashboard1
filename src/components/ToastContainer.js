import { useNotifications } from "../context/NotificationContext";
import "../styles/toast.css";

function ToastContainer() {
  const { notifications,removeNotification } = useNotifications();

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className={`toast ${n.type}`}>
          <div className="toast-message">{n.message}  <span onClick={() => removeNotification(n.id)}>✖</span></div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;