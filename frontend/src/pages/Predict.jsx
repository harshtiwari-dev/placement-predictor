import { useState } from "react";
import axios from "axios";

function Predict() {
  const [formData, setFormData] = useState({
    ssc_p: "",
    hsc_p: "",
    degree_p: "",
    etest_p: "",
    mba_p: "",
    gender_M: "0",
    ssc_b_Others: "0",
    hsc_b_Others: "0",
    hsc_s_Commerce: "0",
    hsc_s_Science: "0",
    degree_t_Others: "0",
    "degree_t_Sci&Tech": "0",
    workex_Yes: "0",
    "specialisation_Mkt&HR": "0",
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
        ...formData,
        ssc_p: Number(formData.ssc_p),
        hsc_p: Number(formData.hsc_p),
        degree_p: Number(formData.degree_p),
        etest_p: Number(formData.etest_p),
        mba_p: Number(formData.mba_p),
        gender_M: Number(formData.gender_M),
        ssc_b_Others: Number(formData.ssc_b_Others),
        hsc_b_Others: Number(formData.hsc_b_Others),
        hsc_s_Commerce: Number(formData.hsc_s_Commerce),
        hsc_s_Science: Number(formData.hsc_s_Science),
        degree_t_Others: Number(formData.degree_t_Others),
        "degree_t_Sci&Tech": Number(formData["degree_t_Sci&Tech"]),
        workex_Yes: Number(formData.workex_Yes),
        "specialisation_Mkt&HR": Number(formData["specialisation_Mkt&HR"]),
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
              <label className="text-slate-200 text-sm mb-1 block">10th Percentage</label>
              <input
                type="number" name="ssc_p" value={formData.ssc_p} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">12th Percentage</label>
              <input
                type="number" name="hsc_p" value={formData.hsc_p} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Degree Percentage</label>
              <input
                type="number" name="degree_p" value={formData.degree_p} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Employability Test %</label>
              <input
                type="number" name="etest_p" value={formData.etest_p} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">MBA Percentage</label>
              <input
                type="number" name="mba_p" value={formData.mba_p} onChange={handleChange}
                required min="0" max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Gender</label>
              <select
                name="gender_M" value={formData.gender_M} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">Female</option>
                <option value="1">Male</option>
              </select>
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">10th Board</label>
              <select
                name="ssc_b_Others" value={formData.ssc_b_Others} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">Central</option>
                <option value="1">Others</option>
              </select>
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">12th Board</label>
              <select
                name="hsc_b_Others" value={formData.hsc_b_Others} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">Central</option>
                <option value="1">Others</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-slate-200 text-sm mb-1 block">12th Stream</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    hsc_s_Commerce: val === "Commerce" ? "1" : "0",
                    hsc_s_Science: val === "Science" ? "1" : "0",
                  });
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-slate-200 text-sm mb-1 block">Degree Type</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    degree_t_Others: val === "Others" ? "1" : "0",
                    "degree_t_Sci&Tech": val === "Sci&Tech" ? "1" : "0",
                  });
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="Comm&Mgmt">Commerce & Management</option>
                <option value="Sci&Tech">Science & Tech</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">Work Experience</label>
              <select
                name="workex_Yes" value={formData.workex_Yes} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-slate-200 text-sm mb-1 block">MBA Specialisation</label>
              <select
                name="specialisation_Mkt&HR" value={formData["specialisation_Mkt&HR"]} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="0">Mkt & Finance</option>
                <option value="1">Mkt & HR</option>
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