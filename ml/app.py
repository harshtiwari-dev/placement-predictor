from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

model_lr = joblib.load("model.pkl")
explainer = joblib.load("explainer.pkl")
feature_columns = joblib.load("feature_columns.pkl")
probability_distribution = joblib.load("probability_distribution.pkl")

FEATURE_LABELS = {
    "CGPA": "CGPA",
    "Internships": "Internships Completed",
    "Projects": "Projects Completed",
    "Workshops/Certifications": "Workshops & Certifications",
    "AptitudeTestScore": "Aptitude Test Score",
    "SoftSkillsRating": "Soft Skills Rating (Communication, Leadership, Teamwork)",
    "ExtracurricularActivities": "Extracurricular Activities",
    "PlacementTraining": "Placement Training",
    "SSC_Marks": "10th (SSC) Marks",
    "HSC_Marks": "12th (HSC) Marks"
}

RECOMMENDATION_TEMPLATES = {
    "CGPA": "Your CGPA is significantly affecting your prediction — maintaining strong academic performance improves your chances.",
    "Internships": "Completing internships is affecting your prediction — consider taking up an internship to strengthen your profile.",
    "Projects": "The number of projects you've completed is affecting your prediction — building more hands-on projects strengthens your profile.",
    "Workshops/Certifications": "Workshops and certifications are a factor — completing relevant certifications can help.",
    "AptitudeTestScore": "Your aptitude test score is a major factor — practicing aptitude tests and logical reasoning can significantly help.",
    "SoftSkillsRating": "Your soft skills rating is a major factor — working on communication, teamwork, and interpersonal skills can help.",
    "ExtracurricularActivities": "Participation in extracurricular activities is affecting your prediction — getting involved in clubs, sports, or events could help.",
    "PlacementTraining": "Completing placement training is a major factor — enrolling in placement preparation programs can significantly help.",
    "SSC_Marks": "Your 10th (SSC) marks are a factor — this reflects your foundational academic performance.",
    "HSC_Marks": "Your 12th (HSC) marks are a factor — this reflects your pre-college academic performance."
}

# Valid ranges for each feature — mirrors the checks in Express (predict.js)
# and the frontend (constants.js), so all three layers agree.
FIELD_RULES = {
    "CGPA": (0, 10),
    "Internships": (0, 2),
    "Projects": (0, 3),
    "Workshops/Certifications": (0, 3),
    "AptitudeTestScore": (0, 100),
    "SoftSkillsRating": (0, 5),
    "ExtracurricularActivities": (0, 1),
    "PlacementTraining": (0, 1),
    "SSC_Marks": (0, 100),
    "HSC_Marks": (0, 100),
}


def validate_input(data):
    """Returns an error message string if invalid, or None if valid."""
    if not isinstance(data, dict):
        return "Request body must be a JSON object."

    for field, (min_val, max_val) in FIELD_RULES.items():
        if field not in data or data[field] is None or data[field] == "":
            return f"Missing required field: {field}"

        try:
            value = float(data[field])
        except (TypeError, ValueError):
            return f"{field} must be a number"

        if value < min_val or value > max_val:
            return f"{field} must be between {min_val} and {max_val}"

    return None


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({"message": "Invalid or missing JSON body"}), 400

    validation_error = validate_input(data)
    if validation_error:
        return jsonify({"message": validation_error}), 400

    input_df = pd.DataFrame([data], columns=feature_columns)

    probability = model_lr.predict_proba(input_df)[0][1]
    readiness_score = round(probability * 100)
    percentile = round((probability_distribution < probability).mean() * 100)

    shap_values = explainer(input_df)
    shap_row = shap_values[0]
    importance = pd.Series(shap_row.values, index=feature_columns).sort_values(key=abs, ascending=False)

    strengths = importance[importance > 0].head(3)
    weaknesses = importance[importance < 0].head(3)

    response = {
        "probability": round(probability * 100, 1),
        "readiness_score": readiness_score,
        "percentile": percentile,
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


@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": "Route not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"message": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)