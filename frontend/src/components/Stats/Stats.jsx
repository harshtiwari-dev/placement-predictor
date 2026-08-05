import { motion } from "framer-motion";
import { Database, Target, Brain, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Database, label: "Training Records", value: "10,000+" },
  { icon: Target, label: "Model Accuracy", value: "79.4%" },
  { icon: Brain, label: "Explainable Factors", value: "10" },
  { icon: ShieldCheck, label: "Secure & Private", value: "100%" },
];

function Stats() {
  return (
    <section className="max-w-5xl mx-auto px-8 py-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
            <stat.icon size={24} className="text-purple-400 mx-auto mb-3 relative" />
            <p className="text-3xl font-bold relative">{stat.value}</p>
            <p className="text-slate-500 text-sm mt-1.5 relative">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Stats;