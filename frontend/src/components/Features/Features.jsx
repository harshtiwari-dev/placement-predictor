import { motion } from "framer-motion";
import { Zap, Search, TrendingUp, BarChart3, Brain, Lock } from "lucide-react";

const features = [
  { icon: Zap, title: "AI Prediction", desc: "Instant placement probability from a trained Logistic Regression model." },
  { icon: Search, title: "Explainable AI", desc: "SHAP-based reasoning shows exactly which factors influenced your result." },
  { icon: TrendingUp, title: "Readiness Score", desc: "A clear 0-100 score summarizing your overall placement readiness." },
  { icon: BarChart3, title: "Analytics", desc: "Visual radar, bar, and pie charts breaking down your profile." },
  { icon: Brain, title: "SHAP Insights", desc: "Per-student explanations, not just global feature importance." },
  { icon: Lock, title: "Secure Login", desc: "JWT-based authentication with bcrypt-hashed passwords." },
];

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl font-bold text-center mb-16 leading-tight"
      >
        Everything You Need to Understand Your Placement Chances
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="
              bg-white/[0.03]
              border border-white/10
              rounded-2xl
              p-7
              min-h-[260px]
              hover:border-purple-500/40
              transition
            "
          >

            <div className="
              w-12 h-12 
              rounded-xl 
              bg-gradient-to-br from-purple-500/20 to-cyan-500/20 
              flex items-center justify-center 
              mb-6
            ">
              <f.icon size={22} className="text-purple-400" />
            </div>


            <h3 className="font-semibold text-2xl mb-3">
              {f.title}
            </h3>


            <p className="
              text-slate-400 
              text-lg 
              leading-7
              min-h-[84px]
            ">
              {f.desc}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
}

export default Features;