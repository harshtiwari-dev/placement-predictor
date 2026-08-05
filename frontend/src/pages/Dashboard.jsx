import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import StudentForm from "../components/StudentForm/StudentForm";
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
  const [error, setError] = useState("");

  const handlePredict = async (formData) => {
    setError("");
    setLoading(true);
    setLastFormData(formData);
    try {
      const response = await predict(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
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
          <PredictionCard result={result} />
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