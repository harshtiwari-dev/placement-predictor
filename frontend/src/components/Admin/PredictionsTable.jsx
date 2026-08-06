import { motion } from "framer-motion";

function PredictionsTable({ predictions }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-x-auto"
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Predictions
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="pb-3">Student</th>
            <th className="pb-3">Probability</th>
            <th className="pb-3">Readiness</th>
            <th className="pb-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {predictions.map((prediction) => (
            <tr
              key={prediction._id}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="py-4 text-white">
                {prediction.user?.name || "Unknown"}
              </td>

              <td className="py-4">
                <span
                  className={`font-semibold ${
                    prediction.probability >= 50
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {prediction.probability.toFixed(1)}%
                </span>
              </td>

              <td className="py-4 text-cyan-300">
                {prediction.readinessScore}
              </td>

              <td className="py-4 text-slate-400">
                {new Date(prediction.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default PredictionsTable;