export const FIELD_RANGES = {
  CGPA: { min: 0, max: 10, step: 0.01, label: "CGPA (out of 10)" },
  AptitudeTestScore: { min: 0, max: 100, step: 0.01, label: "Aptitude Test Score (out of 100)" },
  SSC_Marks: { min: 0, max: 100, step: 0.01, label: "10th Percentage" },
  HSC_Marks: { min: 0, max: 100, step: 0.01, label: "12th Percentage" },
  Internships: { min: 0, max: 2, step: 1, label: "Internships" },
  Projects: { min: 0, max: 3, step: 1, label: "Projects Completed" },
  "Workshops/Certifications": { min: 0, max: 3, step: 1, label: "Workshops/Certifications" },
  SoftSkillsRating: { min: 0, max: 5, step: 0.1, label: "Soft Skills Rating" },
};

export const SOFT_SKILLS_MIN = 3.0;
export const SOFT_SKILLS_MAX = 4.8;

export function convertSoftSkillsToModelScale(userInput) {
  return SOFT_SKILLS_MIN + (Number(userInput) / 5) * (SOFT_SKILLS_MAX - SOFT_SKILLS_MIN);
}

export const THEME = {
  background: "#0B1020",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};
