import { motion } from "framer-motion";

const stack = [
  { name: "React", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "Flask", category: "ML API" },
  { name: "scikit-learn", category: "Machine Learning" },
  { name: "SHAP", category: "Explainability" },
  { name: "JWT + bcrypt", category: "Security" },
];

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "ML API",
  "Machine Learning",
  "Explainability",
  "Security",
];

function Technology() {
  return (
    <section id="technology" className="py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2
            className="
              max-w-4xl
              text-4xl
              lg:text-5xl
              font-bold
              leading-tight
            "
          >
            Technology Stack
          </h2>

          <p
            className="
              text-slate-400
              text-base
              leading-7
              mt-4
              max-w-2xl
            "
          >
            The system combines modern web technologies with machine learning
            and explainable AI to deliver transparent placement predictions.
          </p>
        </motion.div>


        {/* Technology Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {categories.map((category, categoryIndex) => {

            const technologies = stack.filter(
              (tech) => tech.category === category
            );

            if (technologies.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.08 }}
                className="
                  bg-white/[0.03]
                  border border-white/10
                  rounded-2xl
                  p-6
                  hover:border-cyan-500/30
                  hover:-translate-y-1
                  transition
                "
              >

                {/* Category */}
                <h3
                  className="
                    text-sm
                    font-medium
                    text-cyan-400
                    uppercase
                    tracking-wider
                    mb-4
                  "
                >
                  {category}
                </h3>


                {/* Technologies */}
                <div className="space-y-3">

                  {technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="
                        flex
                        items-center
                        justify-between
                        py-2
                        border-b
                        border-white/5
                        last:border-0
                      "
                    >

                      <span className="text-base font-medium">
                        {tech.name}
                      </span>

                      <span className="text-sm text-slate-500">
                        {tech.category}
                      </span>

                    </div>
                  ))}

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Technology;