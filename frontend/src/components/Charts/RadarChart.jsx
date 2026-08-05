import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

function SkillsRadarChart({ formData }) {
  // Normalize each field to a 0-100 scale for fair visual comparison
  const data = [
    { subject: "CGPA", value: (Number(formData.CGPA) / 10) * 100 },
    { subject: "Aptitude", value: Number(formData.AptitudeTestScore) },
    { subject: "Soft Skills", value: (Number(formData.SoftSkillsRating) / 5) * 100 },
    { subject: "10th %", value: Number(formData.SSC_Marks) },
    { subject: "12th %", value: Number(formData.HSC_Marks) },
    { subject: "Extracurricular", value: Number(formData.ExtracurricularActivities) * 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-white font-semibold mb-4">Skills Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 10 }} />
          <Radar name="Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.35} strokeWidth={2} />
        </RechartsRadar>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default SkillsRadarChart;