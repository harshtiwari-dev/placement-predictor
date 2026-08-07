import { motion } from "framer-motion";
import {
  FileEdit,
  Cpu,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: FileEdit,
    title: "Enter Your Details",
    desc: "Fill in academic scores, aptitude, projects, and skills — takes under a minute.",
  },
  {
    icon: Cpu,
    title: "AI Prediction",
    desc: "A Logistic Regression model trained on 10,000 student records estimates your placement probability.",
  },
  {
    icon: Lightbulb,
    title: "SHAP Analysis",
    desc: "Explainable AI breaks down exactly which factors helped or hurt your prediction.",
  },
  {
    icon: TrendingUp,
    title: "Get Recommendations",
    desc: "Receive concrete, actionable suggestions to improve your placement readiness.",
  },
];

function Workflow() {
  return (
    <section id="workflow" className="py-24">

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
          "
        >
          How It Works
        </motion.h2>


        {/* Workflow Timeline */}
        <div className="relative max-w-4xl">

          {/* Timeline Line */}
          <div
            className="
              absolute
              left-6
              top-0
              bottom-0
              w-px
              bg-gradient-to-b
              from-purple-500
              via-cyan-500
              to-transparent
            "
          />


          {/* Steps */}
          <div className="space-y-12">

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6 items-start"
              >

                {/* Step Icon */}
                <div
                  className="
                    relative
                    z-10
                    w-12
                    h-12
                    rounded-full
                    bg-gradient-to-br
                    from-purple-500
                    to-cyan-500
                    flex
                    items-center
                    justify-center
                    shrink-0
                    shadow-lg
                    shadow-purple-500/30
                  "
                >
                  <step.icon size={20} />
                </div>


                {/* Step Content */}
                <div className="pt-1 transition-transform hover:translate-x-1">

                  <h3 className="font-semibold text-xl mb-2">
                    {step.title}
                  </h3>

                  <p
                    className="
                      text-slate-400
                      text-base
                      leading-7
                      max-w-xl
                    "
                  >
                    {step.desc}
                  </p>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default Workflow;