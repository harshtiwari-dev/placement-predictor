import { motion } from "framer-motion";
import { Brain, TrendingUp } from "lucide-react";

function CircularGauge({ percentage }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color = percentage >= 60 ? "#22C55E" : percentage >= 35 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="80" cy="80" r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-white"
        >
          {percentage}%
        </motion.span>
        <span className="text-slate-400 text-xs mt-1">Placement Probability</span>
      </div>
    </div>
  );
}

function PredictionCard({ result }) {
  if (!result) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-10 border border-white/10 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain size={56} className="text-purple-400/50 mb-4" />
        </motion.div>
        <p className="text-slate-400">Waiting for Prediction</p>
        <p className="text-slate-600 text-sm mt-1">Fill in your details to get started</p>
      </div>
    );
  }

  const status = result.probability >= 50 ? "Placed" : "Not Placed";
  const statusColor = result.probability >= 50 ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <CircularGauge percentage={result.probability} />

      <div className="flex items-center justify-center gap-2 mt-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {status === "Placed" ? "Likely to be Placed" : "Needs Improvement"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs">Readiness Score</p>
          <p className="text-white text-2xl font-bold">{result.readiness_score}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
            <TrendingUp size={12} /> Percentile
          </p>
          <p className="text-white text-2xl font-bold">{result.percentile}%</p>
        </div>
      </div>

      <p className="text-slate-400 text-xs text-center mt-4">
        You rank better than {result.percentile}% of students in our evaluation set
      </p>
    </motion.div>
  );
}

export default PredictionCard;