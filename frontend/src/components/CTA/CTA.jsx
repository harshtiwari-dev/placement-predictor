import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="
          relative
          bg-gradient-to-br
          from-purple-500/10
          to-cyan-500/10
          border
          border-white/10
          rounded-3xl
          p-10
          md:p-12
          overflow-hidden
        "
      >

        <div className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          h-40
          w-40
          rounded-full
          bg-purple-500/20
          blur-[100px]
        " />


        <h2 className="
          relative
          text-4xl
          md:text-5xl
          font-bold
          mb-5
        ">
          Ready to Check Your Chances?
        </h2>


        <p className="
          relative
          text-slate-400
          text-lg
          leading-8
          mb-8
          max-w-2xl
          mx-auto
        ">
          Sign up in seconds and get your personalized, explainable placement prediction.
        </p>


        <Link
          to="/signup"
          className="
            relative
            inline-flex
            items-center
            gap-2
            bg-gradient-to-r
            from-purple-500
            to-cyan-500
            text-white
            px-7
            py-4
            rounded-xl
            font-semibold
            hover:scale-105
            transition
          "
        >
          Get Started Free
          <ArrowRight size={18} />
        </Link>


      </motion.div>

    </section>
  );
}

export default CTA;