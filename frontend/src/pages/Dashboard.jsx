import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import StudentForm from "../components/StudentForm/StudentForm";
import LoadingCard from "../components/Loading/LoadingCard";
import PredictionCard from "../components/PredictionCard/PredictionCard";
import RecommendationCard from "../components/RecommendationCard/RecommendationCard";
import SkillsRadarChart from "../components/Charts/RadarChart";
import ExperienceBarChart from "../components/Charts/BarChart";
import ProbabilityPieChart from "../components/Charts/PieChart";
import { predict } from "../services/api";

const loadingStages = [
  "Collecting student profile...",
  "Validating input features...",
  "Running placement prediction model...",
  "Generating SHAP explanations...",
  "Identifying strengths and weaknesses...",
  "Preparing personalized recommendations...",
];

const MIN_LOADING_MS = 3500; // tune this to taste

function Dashboard() {
  const [result, setResult] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState([]);
  const [error, setError] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handlePredict = async (formData) => {
    setError("");
    setResult(null);
    setLoading(true);
    setLastFormData(formData);
    setLoadingStage([loadingStages[0]]);

    let currentStage = 0;

    intervalRef.current = setInterval(() => {
      currentStage++;
      if (currentStage < loadingStages.length) {
        setLoadingStage((prev) => [...prev, loadingStages[currentStage]]);
      } else {
        clearInterval(intervalRef.current);
      }
    }, 600);

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS));
      const [response] = await Promise.all([predict(formData), minDelay]);

      clearInterval(intervalRef.current);
      setLoadingStage([...loadingStages, "✅ Prediction Complete"]);
      setResult(response.data);
    } catch (err) {
      clearInterval(intervalRef.current);
      setError(err.response?.data?.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStage([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6 flex items-center justify-between">
            <span>{error}</span>
            {lastFormData && (
              <button
                onClick={() => handlePredict(lastFormData)}
                className="text-red-300 hover:text-white underline text-xs shrink-0 ml-4"
              >
                Retry
              </button>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <StudentForm onSubmit={handlePredict} loading={loading} />
          {loading ? (
            <LoadingCard stage={loadingStage} />
          ) : (
            <PredictionCard result={result} />
          )}
        </div>

        {result && (
          <>
            <RecommendationCard result={result} />

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <SkillsRadarChart formData={lastFormData} />
              <ExperienceBarChart formData={lastFormData} />
              <ProbabilityPieChart result={result} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;