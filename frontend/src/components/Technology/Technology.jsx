import { motion } from "framer-motion";

const stack = [
  { name: "React", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "Flask", category: "ML API" },
  { name: "scikit-learn", category: "ML" },
  { name: "SHAP", category: "Explainability" },
  { name: "JWT + bcrypt", category: "Security" },
];

function Technology() {
  return (
    <section id="technology" className="max-w-6xl mx-auto px-6 py-24">

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl font-bold text-center mb-5"
      >
        Built With
      </motion.h2>


      <p className="
        text-slate-400
        text-lg
        leading-7
        text-center
        mb-12
        max-w-2xl
        mx-auto
      ">
        A full-stack system combining machine learning, explainable AI, and modern web technology.
      </p>


      <div className="flex flex-wrap justify-center gap-4">

        {stack.map((tech, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="
              bg-white/[0.03]
              border border-white/10
              rounded-full
              px-6
              py-3
              flex
              items-center
              gap-2
              hover:border-cyan-500/40
              transition
            "
          >

            <span className="font-medium text-base">
              {tech.name}
            </span>

            <span className="text-slate-500 text-sm">
              · {tech.category}
            </span>

          </motion.div>
        ))}

      </div>

    </section>
  );
}

export default Technology;