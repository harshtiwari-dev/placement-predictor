import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import StudentForm from "../components/StudentForm/StudentForm";
import LoadingCard from "../components/Loading/LoadingCard";
import PredictionCard from "../components/PredictionCard/PredictionCard";
import RecommendationCard from "../components/RecommendationCard/RecommendationCard";
import SkillsRadarChart from "../components/Charts/RadarChart";
import ExperienceBarChart from "../components/Charts/BarChart";
import ProbabilityPieChart from "../components/Charts/PieChart";
import { predict } from "../services/api";

function Dashboard() {
  const [result, setResult] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState([]);
  const [error, setError] = useState("");

  const loadingStages = [
    "Collecting student profile...",
    "Validating input features...",
    "Running placement prediction model...",
    "Generating SHAP explanations...",
    "Identifying strengths and weaknesses...",
    "Preparing personalized recommendations...",
    "Finalizing AI report..."
  ];

  const handlePredict = async (formData) => {
    setError("");
    setLoading(true);
    setLoadingStage([loadingStages[0]]);
    setLastFormData(formData);
    let currentStage = 0;

    const interval = setInterval(() => {
      currentStage++;

      if (currentStage < loadingStages.length) {
        setLoadingStage((prev) => [...prev, loadingStages[currentStage]]);
      }
    }, 700);

    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const response = await predict(formData);

      clearInterval(interval);

      setLoadingStage((prev) => [...prev, "✅ Prediction Complete"]);

      setResult(response.data);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
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