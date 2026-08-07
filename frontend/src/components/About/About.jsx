import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const trustPoints = [
  "Explainable AI (SHAP)",
  "Logistic Regression Model",
  "JWT Authentication",
  "Flask ML API",
  "MongoDB Database",
  "bcrypt Password Hashing",
];

function About() {
  return (
    <section id="about" className="py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 max-w-4xl"
        >

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            About This Project
          </h2>

          <p
            className="
              text-slate-400
              text-base
              leading-7
              max-w-4xl
            "
          >
            This is a final-year academic project combining machine learning,
            explainable AI, and full-stack web development. Unlike systems
            that only output "Placed" or "Not Placed," this platform shows
            your placement probability, a relative percentile ranking, and
            transparent, SHAP-based reasoning behind every prediction —
            turning a black-box prediction into an actionable,
            understandable result.
          </p>

        </motion.div>


        {/* Technical Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            max-w-6xl
          "
        >

          {trustPoints.map((point, i) => (
            <div
              key={i}
              className="
                flex
                items-center
                gap-3
                bg-white/[0.03]
                border border-white/10
                rounded-xl
                px-5
                py-4
                hover:border-cyan-500/30
                transition
              "
            >

              <CheckCircle2
                size={18}
                className="text-green-400 shrink-0"
              />

              <span className="text-base text-slate-300">
                {point}
              </span>

            </div>
          ))}

        </motion.div>

      </div>

    </section>
  );
}

export default About;