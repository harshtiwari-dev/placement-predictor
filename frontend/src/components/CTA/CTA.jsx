import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="max-w-3xl mx-auto px-8 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-12 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-purple-500/20 blur-[100px]" />
        <h2 className="text-3xl font-bold mb-4 relative">Ready to Check Your Chances?</h2>
        <p className="text-slate-400 text-lg mb-8 relative max-w-lg mx-auto">
          Sign up in seconds and get your personalized, explainable placement prediction.
        </p>
        <Link
          to="/signup"
          className="relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:scale-105 transition"
        >
          Get Started Free <ArrowRight size={18} />
        </Link>
      </motion.div>
    </section>
  );
}

export default CTA;