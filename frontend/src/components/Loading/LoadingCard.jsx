import { motion } from "framer-motion";
import { Brain, CheckCircle } from "lucide-react";

function LoadingCard({ stage }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center">

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl"
      >
        <Brain size={48} className="text-white" />
      </motion.div>

      <h2 className="text-white text-2xl font-bold mt-8">
        AI Processing...
      </h2>

      <div className="mt-6 w-full max-w-md text-left space-y-3">
        {stage.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {index === stage.length - 1 ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-[18px] h-[18px] border-2 border-cyan-400 border-t-transparent rounded-full"
              />
            ) : (
              <CheckCircle size={18} className="text-green-400" />
            )}
            <p
              className={
                index === stage.length - 1
                  ? "text-white font-medium"
                  : "text-slate-400"
              }
            >
              {item}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default LoadingCard;