import { motion } from "framer-motion";
import {
  Zap,
  Search,
  TrendingUp,
  BarChart3,
  Brain,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Prediction",
    desc: "Instant placement probability from a trained Logistic Regression model.",
  },
  {
    icon: Search,
    title: "Explainable AI",
    desc: "SHAP-based reasoning shows exactly which factors influenced your result.",
  },
  {
    icon: TrendingUp,
    title: "Readiness Score",
    desc: "A clear 0-100 score summarizing your overall placement readiness.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Visual radar, bar, and pie charts breaking down your profile.",
  },
  {
  icon: Brain,
  title: "Personalized Insights",
  desc: "Understand your strongest and weakest areas with student-specific recommendations.",
},
  {
    icon: Lock,
    title: "Secure Login",
    desc: "JWT-based authentication with bcrypt-hashed passwords.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="
            max-w-4xl
            text-4xl
            lg:text-5xl
            font-bold
            text-left
            mb-12
            leading-tight
          "
        >
          Everything You Need to Understand Your Placement Chances
        </motion.h2>


        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="
                h-full
                bg-white/[0.03]
                border border-white/10
                rounded-2xl
                p-6
                hover:border-purple-500/40
                hover:-translate-y-1
                transition
              "
            >

              {/* Icon */}
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-gradient-to-br
                  from-purple-500/20
                  to-cyan-500/20
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <f.icon
                  size={22}
                  className="text-purple-400"
                />
              </div>


              {/* Title */}
              <h3 className="font-semibold text-xl mb-3">
                {f.title}
              </h3>


              {/* Description */}
              <p
                className="
                  text-slate-400
                  text-base
                  leading-7
                "
              >
                {f.desc}
              </p>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;