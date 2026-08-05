import { Pie, PieChart as RechartsPie, Cell, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

function ProbabilityPieChart({ result }) {
  if (!result) return null;

  const data = [
    { name: "Placement Probability", value: result.probability },
    { name: "Remaining", value: 100 - result.probability },
  ];

  const COLORS = ["#8B5CF6", "rgba(255,255,255,0.06)"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-white font-semibold mb-4">Probability Split</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsPie>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i]} stroke="none" />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
          />
        </RechartsPie>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ProbabilityPieChart;