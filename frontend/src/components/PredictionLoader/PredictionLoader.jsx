import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  BarChart3,
  Search,
  Target,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Reading Academic Profile...",
    subtitle: "Validating submitted information",
    progress: 10,
  },
  {
    icon: BarChart3,
    title: "Comparing with Training Dataset...",
    subtitle: "Analyzing against 10,000 student records",
    progress: 30,
  },
  {
    icon: Brain,
    title: "Running Logistic Regression Model...",
    subtitle: "Computing placement probability",
    progress: 50,
  },
  {
    icon: Search,
    title: "Generating SHAP Explanations...",
    subtitle: "Identifying influential factors",
    progress: 70,
  },
  {
    icon: Target,
    title: "Calculating Placement Readiness...",
    subtitle: "Computing readiness score",
    progress: 90,
  },
  {
    icon: Lightbulb,
    title: "Building Recommendations...",
    subtitle: "Preparing strengths and weaknesses",
    progress: 100,
  },
];

function PredictionLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === steps.length - 1) return prev;
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="h-full flex flex-col justify-center items-center text-center px-8">

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
        className="mb-8"
      >
        <Icon size={72} className="text-purple-400" />
      </motion.div>

      <motion.h2
        key={step.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-white"
      >
        {step.title}
      </motion.h2>

      <motion.p
        key={step.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-slate-400 mt-3"
      >
        {step.subtitle}
      </motion.p>

      <div className="w-full max-w-sm mt-8">

        <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">

          <motion.div
            animate={{
              width: `${step.progress}%`,
            }}
            transition={{
              duration: 0.6,
            }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
          />

        </div>

        <p className="text-cyan-400 mt-3">
          {step.progress}%
        </p>

      </div>

      <div className="mt-10 space-y-2 text-left">

        {steps.map((s, index) => {

          const StepIcon =
            index < currentStep
              ? CheckCircle2
              : s.icon;

          return (
            <div
              key={s.title}
              className={`flex items-center gap-3 ${
                index <= currentStep
                  ? "text-white"
                  : "text-slate-500"
              }`}
            >
              <StepIcon size={18} />
              <span>{s.title}</span>
            </div>
          );
        })}

      </div>

    </div>
  );
}

export default PredictionLoader;