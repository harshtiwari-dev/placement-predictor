import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Brain, Users } from "lucide-react";
import { convertSoftSkillsToModelScale } from "../../utils/constants";

function StudentForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    CGPA: "",
    AptitudeTestScore: "",
    SSC_Marks: "",
    HSC_Marks: "",
    Internships: "0",
    Projects: "0",
    "Workshops/Certifications": "0",
    SoftSkillsRating: "2.5",
    ExtracurricularActivities: "0",
    PlacementTraining: "0",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      CGPA: Number(formData.CGPA),
      Internships: Number(formData.Internships),
      Projects: Number(formData.Projects),
      "Workshops/Certifications": Number(formData["Workshops/Certifications"]),
      AptitudeTestScore: Number(formData.AptitudeTestScore),
      SoftSkillsRating: convertSoftSkillsToModelScale(formData.SoftSkillsRating),
      ExtracurricularActivities: Number(formData.ExtracurricularActivities),
      PlacementTraining: Number(formData.PlacementTraining),
      SSC_Marks: Number(formData.SSC_Marks),
      HSC_Marks: Number(formData.HSC_Marks),
    };
    onSubmit(payload);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition";
  const labelClass = "text-slate-300 text-sm mb-1.5 flex items-center gap-1.5";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6"
    >
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <GraduationCap size={18} className="text-purple-400" /> Academic Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>CGPA (out of 10)</label>
            <input type="number" step="0.01" name="CGPA" value={formData.CGPA} onChange={handleChange} required min="0" max="10" className={inputClass} placeholder="e.g. 7.93" />
          </div>
          <div>
            <label className={labelClass}>10th Percentage</label>
            <input type="number" step="0.01" name="SSC_Marks" value={formData.SSC_Marks} onChange={handleChange} required min="0" max="100" className={inputClass} placeholder="e.g. 85" />
          </div>
          <div>
            <label className={labelClass}>12th Percentage</label>
            <input type="number" step="0.01" name="HSC_Marks" value={formData.HSC_Marks} onChange={handleChange} required min="0" max="100" className={inputClass} placeholder="e.g. 82" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Briefcase size={18} className="text-cyan-400" /> Experience
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Internships</label>
            <input type="number" name="Internships" value={formData.Internships} onChange={handleChange} required min="0" max="2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Projects</label>
            <input type="number" name="Projects" value={formData.Projects} onChange={handleChange} required min="0" max="3" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Certifications</label>
            <input type="number" name="Workshops/Certifications" value={formData["Workshops/Certifications"]} onChange={handleChange} required min="0" max="3" className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Brain size={18} className="text-purple-400" /> Skills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Aptitude Test Score (out of 100)</label>
            <input type="number" step="0.01" name="AptitudeTestScore" value={formData.AptitudeTestScore} onChange={handleChange} required min="0" max="100" className={inputClass} placeholder="e.g. 75" />
          </div>
          <div>
            <label className={labelClass}>Soft Skills Rating (out of 5)</label>
            <input type="number" step="0.1" name="SoftSkillsRating" value={formData.SoftSkillsRating} onChange={handleChange} required min="0" max="5" className={inputClass} />
            <span className="text-slate-500 text-xs mt-1 block">Communication, leadership, teamwork</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Users size={18} className="text-cyan-400" /> Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Extracurricular Activities</label>
            <select name="ExtracurricularActivities" value={formData.ExtracurricularActivities} onChange={handleChange} className={`${inputClass} bg-[#151827] appearance-none`}>
              <option className="bg-[#151827] text-gray-200" value="0">No</option>
              <option className="bg-[#151827] text-gray-200" value="1">Yes</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Placement Training</label>
            <select
  name="PlacementTraining"
  value={formData.PlacementTraining}
  onChange={handleChange}
  className={`${inputClass} bg-[#151827] appearance-none`}
>
  <option className="bg-[#151827] text-gray-200" value="0">
    No
  </option>
  <option className="bg-[#151827] text-gray-200" value="1">
    Yes
  </option>
</select>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50 transition"
      >
        {loading ? "Analyzing..." : "Predict Placement"}
      </motion.button>
    </motion.form>
  );
}

export default StudentForm;