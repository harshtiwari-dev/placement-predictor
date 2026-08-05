import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function RecommendationCard({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10 mt-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 size={18} /> Strengths
          </h3>
          <div className="space-y-2">
            {result.strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-green-500/[0.06] border-l-2 border-green-500 rounded-lg p-3"
              >
                <p className="text-white text-sm font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Areas to Improve
          </h3>
          <div className="space-y-2">
            {result.weaknesses.length === 0 && (
              <div className="bg-green-500/[0.06] border-l-2 border-green-500 rounded-lg p-3">
                <p className="text-white text-sm">No significant weaknesses detected — strong profile overall.</p>
              </div>
            )}
            {result.weaknesses.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-amber-500/[0.06] border-l-2 border-amber-500 rounded-lg p-3"
              >
                <p className="text-white text-sm font-medium">{w.label}</p>
                <p className="text-slate-400 text-xs mt-1">{w.suggestion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RecommendationCard;