import { Bar, BarChart as RechartsBar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

function ExperienceBarChart({ formData }) {
  const data = [
    { name: "Internships", value: Number(formData.Internships), color: "#8B5CF6" },
    { name: "Projects", value: Number(formData.Projects), color: "#06B6D4" },
    { name: "Certifications", value: Number(formData["Workshops/Certifications"]), color: "#A78BFA" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-white font-semibold mb-4">Experience Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ExperienceBarChart;