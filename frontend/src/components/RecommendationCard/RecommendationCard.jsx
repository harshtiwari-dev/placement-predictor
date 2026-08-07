import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function ImpactBar({ impact, positive }) {
  const magnitude = Math.min(Math.abs(impact) / 0.6, 1) * 100; // 0.6 ~ typical max SHAP value, adjust if needed
  return (
    <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${magnitude}%` }}
        transition={{ duration: 0.6 }}
        className={`h-full rounded-full ${positive ? "bg-green-400" : "bg-amber-400"}`}
      />
    </div>
  );
}

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
            {result.strengths.length === 0 && (
              <div className="bg-amber-500/[0.06] border-l-2 border-amber-500 rounded-lg p-3">
                <p className="text-white text-sm">No significant strengths detected — there's room to build up your profile across the board.</p>
              </div>
            )}
            {result.strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-green-500/[0.06] border-l-2 border-green-500 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{s.label}</p>
                  <span className="text-green-400 text-xs font-mono">+{s.impact.toFixed(2)}</span>
                </div>
                <ImpactBar impact={s.impact} positive />
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
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{w.label}</p>
                  <span className="text-amber-400 text-xs font-mono">{w.impact.toFixed(2)}</span>
                </div>
                <ImpactBar impact={w.impact} />
                <p className="text-slate-400 text-xs mt-2">{w.suggestion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RecommendationCard;