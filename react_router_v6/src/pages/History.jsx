import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, Activity } from "lucide-react";
import { api } from "../Api/api";

// 🔥 Risk logic
const getRiskDetails = (score) => {
  if (score >= 70) {
    return { level: "Low", color: "#38a169" };
  } else if (score >= 40) {
    return { level: "Moderate", color: "#f6ad55" };
  } else {
    return { level: "High Risk", color: "#e53e3e" };
  }
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("userEmail");

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/history/${userEmail}`);
        console.log(response.data)
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchHistory();
  }, [userEmail]);

  // Permanent delete
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this prediction permanently?")) return;

    try {
      await api.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      window.location.reload();
    } catch {
      alert("Failed to delete record");
    }
  };

  if (loading) {
    return <div className="loader">Loading your health history...</div>;
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <h2><span className="footer-heart">❤️ </span><span className="pulse">Pulse</span><span className="health">Health</span> Prediction History</h2>
        <p>
          Records for: <span>{userEmail}</span>
        </p>
      </header>

      <div className="history-list">
        <AnimatePresence>
          {history.map((item, index) => {
            const severity = Number(item[2]);
            const risk = getRiskDetails(severity);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="history-card"
                style={{ borderLeft: `6px solid ${risk.color}` }}
              >
                <div className="card-content">
                  {/* LEFT */}
                  <div className="card-info">
                    <div
                      className="risk-badge"
                      style={{ backgroundColor: risk.color }}
                    >
                      {risk.level}
                    </div>

                    <h3>{item.result}</h3>

                    <div className="meta">
                      <span>
                        <Activity size={14} /> {item[3]}
                      </span>
                      <span>
                        <Calendar size={14} /> {item[7]}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="card-actions">
                    <div className="severity">

                      <span><strong style={{ color: risk.color }}>
                        {item[8]}
                      </strong> Health Score </span>
                      <strong style={{ color: risk.color }}>
                        {severity}%
                      </strong>
                    </div>

                    <button
                      onClick={() => deleteRecord(item[0])}
                      className="delete-btn"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <p>No prediction history found.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default History;
