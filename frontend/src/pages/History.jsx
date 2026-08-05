import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { getHistory } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
        <p className="text-slate-400 mb-8">Your past placement predictions, most recent first</p>

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && history.length === 0 && (
          <p className="text-slate-400">No predictions yet — go make your first one!</p>
        )}

        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    item.probability >= 50
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {item.probability >= 50 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-lg">{item.probability}%</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Readiness</p>
                <p className="font-semibold">{item.readinessScore}/100</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;