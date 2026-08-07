import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-br
            from-purple-500/10
            to-cyan-500/10
            p-8
            md:p-12
            lg:p-14
            text-center
          "
        >

          {/* Background Glow */}
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              h-40
              w-40
              rounded-full
              bg-purple-500/20
              blur-[100px]
            "
          />


          {/* Heading */}
          <h2
            className="
              relative
              text-4xl
              md:text-5xl
              font-bold
              leading-tight
              mb-5
            "
          >
            Ready to Check Your Chances?
          </h2>


          {/* Description */}
          <p
            className="
              relative
              text-slate-400
              text-base
              leading-7
              max-w-2xl
              mx-auto
              mb-8
            "
          >
            Sign up in seconds and get your personalized,
            explainable placement prediction.
          </p>


          {/* CTA Button */}
          <Link
            to="/signup"
            className="
              relative
              inline-flex
              items-center
              justify-center
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

      </div>

    </section>
  );
}

export default CTA;