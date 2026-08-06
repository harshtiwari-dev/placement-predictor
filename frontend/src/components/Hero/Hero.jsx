import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>


      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">


          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
          >

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm text-slate-300">
              <Sparkles size={15}/>
              Explainable AI Career Intelligence
            </div>


            <h1 className="
              text-5xl 
              md:text-6xl 
              lg:text-7xl
              tracking-tight
              font-black
              leading-[1.05]
            ">
              Predict Your

              <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Placement Success
              </span>

            </h1>


            <p className="
              mt-8
              text-slate-400
              text-xl
              leading-8
              max-w-xl
            ">
              An AI-powered platform that predicts your placement probability,
              identifies your strengths and weaknesses, and explains every
              prediction using Explainable AI (SHAP).
            </p>


            <div className="mt-10 flex gap-5 flex-wrap">

              <Link
                to="/signup"
                className="
                  px-7
                  py-4
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-600
                  to-cyan-500
                  font-semibold
                  flex
                  items-center
                  gap-2
                  hover:scale-105
                  transition
                "
              >
                Get Started
                <ArrowRight size={18}/>
              </Link>


              <a
                href="#features"
                className="
                  px-7
                  py-4
                  rounded-xl
                  border
                  border-white/10
                  hover:bg-white/5
                  transition
                "
              >
                Learn More
              </a>

            </div>

          </motion.div>



          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
          >

            <div className="relative">

              <div className="
                rounded-3xl
                bg-white/5
                border
                border-white/10
                backdrop-blur-xl
                p-8
                shadow-2xl
              ">


                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-slate-400 text-sm">
                      Placement Probability
                    </p>

                    <h2 className="text-5xl font-bold mt-2">
                      87%
                    </h2>

                  </div>


                  <div className="
                    h-24
                    w-24
                    rounded-full
                    bg-gradient-to-br
                    from-purple-500
                    to-cyan-500
                    flex
                    items-center
                    justify-center
                  ">

                    <span className="font-bold text-xl">
                      AI
                    </span>

                  </div>

                </div>


                <div className="mt-8 space-y-5">

                  {[
                    ["CGPA", "Excellent", "w-[88%]", "bg-purple-500"],
                    ["Communication", "Strong", "w-[74%]", "bg-cyan-400"],
                    ["Projects", "Needs Improvement", "w-[42%]", "bg-orange-400"],
                  ].map(([label, status, width, color]) => (

                    <div key={label}>

                      <div className="flex justify-between text-sm mb-2">
                        <span>{label}</span>
                        <span>{status}</span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-700">
                        <div className={`h-2 rounded-full ${width} ${color}`} />
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </motion.div>


        </div>

      </div>

    </section>
  );
}

export default Hero;