import { useState } from "react";
import axios from "axios";

function Predict() {
  const [formData, setFormData] = useState({
    CGPA: "",
    Internships: "0",
    Projects: "0",
    "Workshops/Certifications": "0",
    AptitudeTestScore: "",
    SoftSkillsRating: "2.5",
    ExtracurricularActivities: "0",
    PlacementTraining: "0",
    SSC_Marks: "",
    HSC_Marks: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        CGPA: Number(formData.CGPA),
        Internships: Number(formData.Internships),
        Projects: Number(formData.Projects),
        "Workshops/Certifications": Number(formData["Workshops/Certifications"]),
        AptitudeTestScore: Number(formData.AptitudeTestScore),
        SoftSkillsRating: 3.0 + (Number(formData.SoftSkillsRating) / 5) * 1.8,
        ExtracurricularActivities: Number(formData.ExtracurricularActivities),
        PlacementTraining: Number(formData.PlacementTraining),
        SSC_Marks: Number(formData.SSC_Marks),
        HSC_Marks: Number(formData.HSC_Marks),
      };

      const response = await axios.post(
        "http://localhost:5001/api/predict",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Placement Prediction
        </h1>
        <p className="text-slate-300 text-center mb-8">
          Enter your academic and skill details to see your placement readiness
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-200 text-sm mb-1 block">CGPA (out of 10)</label>
              <input
                type="number" step="0.01" name="CGPA" value={formData.CGPA} onChange={handleChange}
                required min="0" max="10"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Aptitude Test Score (out of 100)</label>
              <input
                type="number" step="0.01" name="AptitudeTestScore" value={formData.AptitudeTestScore} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">10th Percentage</label>
              <input
                type="number" step="0.01" name="SSC_Marks" value={formData.SSC_Marks} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">12th Percentage</label>
              <input
                type="number" step="0.01" name="HSC_Marks" value={formData.HSC_Marks} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Internships (0-2)</label>
              <input
                type="number" name="Internships" value={formData.Internships} onChange={handleChange}
                required min="0" max="2"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Projects Completed (0-3)</label>
              <input
                type="number" name="Projects" value={formData.Projects} onChange={handleChange}
                required min="0" max="3"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Workshops/Certifications (0-3)</label>
              <input
                type="number" name="Workshops/Certifications" value={formData["Workshops/Certifications"]} onChange={handleChange}
                required min="0" max="3"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">
                Soft Skills Rating (out of 5)
                <span className="text-slate-400 text-xs font-normal ml-1">(communication, leadership, teamwork, etc.)</span>
              </label>
              <input
                type="number" step="0.1" name="SoftSkillsRating" value={formData.SoftSkillsRating} onChange={handleChange}
                required min="0" max="5"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Extracurricular Activities</label>
              <select
                name="ExtracurricularActivities" value={formData.ExtracurricularActivities} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Placement Training</label>
              <select
                name="PlacementTraining" value={formData.PlacementTraining} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict My Placement"}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <p className="text-slate-300 text-sm">Placement Probability</p>
              <p className="text-5xl font-bold text-white">{result.probability}%</p>
              <p className="text-slate-300 mt-2">Readiness Score: {result.readiness_score}/100</p>
              <p className="text-purple-300 text-sm mt-3 bg-purple-500/10 border border-purple-500/30 rounded-lg py-2 px-3 inline-block">
                You rank better than {result.percentile}% of students in our evaluation set
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Strengths</h3>
                {result.strengths.map((s, i) => (
                  <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-2">
                    <p className="text-white text-sm font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-red-400 font-semibold mb-2">Areas to Improve</h3>
                {result.weaknesses.map((w, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-2">
                    <p className="text-white text-sm font-medium">{w.label}</p>
                    <p className="text-slate-300 text-xs mt-1">{w.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict;