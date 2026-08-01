from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

model_lr = joblib.load("model.pkl")
explainer = joblib.load("explainer.pkl")
feature_columns = joblib.load("feature_columns.pkl")

FEATURE_LABELS = {
    "IQ": "IQ Score",
    "Prev_Sem_Result": "Previous Semester Result",
    "CGPA": "CGPA",
    "Academic_Performance": "Academic Performance",
    "Extra_Curricular_Score": "Extra-Curricular Score",
    "Communication_Skills": "Communication Skills",
    "Projects_Completed": "Projects Completed",
    "Internship_Experience_Yes": "Internship Experience"
}

RECOMMENDATION_TEMPLATES = {
    "IQ": "Your IQ score is influencing your prediction — this reflects general aptitude, consider practicing logical reasoning and aptitude tests.",
    "Prev_Sem_Result": "Your previous semester result is a factor — maintaining consistent academic performance each semester helps.",
    "CGPA": "Your CGPA is significantly affecting your prediction — maintaining strong academic performance improves your chances.",
    "Academic_Performance": "Your overall academic performance is a factor — focus on consistent grades across subjects.",
    "Extra_Curricular_Score": "Your extra-curricular involvement is a minor factor — participating in more activities could help slightly.",
    "Communication_Skills": "Your communication skills are a major factor — practicing public speaking, group discussions, and interviews can significantly help.",
    "Projects_Completed": "The number of projects you've completed is affecting your prediction — building more hands-on projects strengthens your profile.",
    "Internship_Experience_Yes": "Lack of internship experience is affecting your prediction — consider taking up an internship to strengthen your profile."
}
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_df = pd.DataFrame([data], columns=feature_columns).fillna(0)

    probability = model_lr.predict_proba(input_df)[0][1]
    readiness_score = round(probability * 100)

    shap_values = explainer(input_df)
    shap_row = shap_values[0]
    importance = pd.Series(shap_row.values, index=feature_columns).sort_values(key=abs, ascending=False)

    strengths = importance[importance > 0].head(3)
    weaknesses = importance[importance < 0].head(3)

    response = {
        "probability": round(probability * 100, 1),
        "readiness_score": readiness_score,
        "strengths": [
            {"feature": f, "label": FEATURE_LABELS.get(f, f), "impact": round(v, 2)}
            for f, v in strengths.items()
        ],
        "weaknesses": [
            {
                "feature": f,
                "label": FEATURE_LABELS.get(f, f),
                "impact": round(v, 2),
                "suggestion": RECOMMENDATION_TEMPLATES.get(f, "This factor is influencing your prediction.")
            }
            for f, v in weaknesses.items()
        ]
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)