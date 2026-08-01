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
    "ssc_p": "10th Percentage",
    "hsc_p": "12th Percentage",
    "degree_p": "Degree Percentage",
    "etest_p": "Employability Test Score",
    "mba_p": "MBA Percentage",
    "gender_M": "Gender (Male)",
    "ssc_b_Others": "10th Board (Others)",
    "hsc_b_Others": "12th Board (Others)",
    "hsc_s_Commerce": "12th Stream (Commerce)",
    "hsc_s_Science": "12th Stream (Science)",
    "degree_t_Others": "Degree Type (Others)",
    "degree_t_Sci&Tech": "Degree Type (Science & Tech)",
    "workex_Yes": "Work Experience",
    "specialisation_Mkt&HR": "Specialisation (Marketing & HR)"
}

RECOMMENDATION_TEMPLATES = {
    "ssc_p": "Your 10th percentage is a strong influence — improving academic consistency early on correlates with better placement outcomes.",
    "hsc_p": "Your 12th percentage is affecting your prediction — a stronger foundation here is associated with higher placement probability.",
    "degree_p": "Your degree percentage matters significantly — maintaining strong academic performance in your core degree improves your chances.",
    "etest_p": "Your employability test score has some influence — practicing aptitude and employability tests could help.",
    "mba_p": "Your MBA percentage is a factor — but note its effect can vary depending on your overall academic profile.",
    "workex_Yes": "Lack of work experience is affecting your prediction — consider taking up an internship to strengthen your profile.",
    "gender_M": "This factor reflects a pattern in historical data, not a controllable skill — focus on the other factors listed.",
    "hsc_s_Commerce": "Your 12th stream is a minor factor in this prediction.",
    "hsc_s_Science": "Your 12th stream is a minor factor in this prediction.",
    "degree_t_Others": "Your degree type is a minor factor in this prediction.",
    "degree_t_Sci&Tech": "Your degree type is a minor factor in this prediction.",
    "specialisation_Mkt&HR": "Your MBA specialisation is a minor factor in this prediction.",
    "ssc_b_Others": "Your 10th board is a minor factor in this prediction.",
    "hsc_b_Others": "Your 12th board is a minor factor in this prediction."
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