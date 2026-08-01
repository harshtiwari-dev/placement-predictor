## SHAP + numpy compatibility issue
Encountered a TypeError when running shap.plots.beeswarm() due to boolean (True/False) 
columns from one-hot encoding being incompatible with numpy's rounding function in 
this SHAP version. Fixed by explicitly casting all boolean columns to integers (0/1) 
in clean.py after encoding.
## Two-backend architecture (Node + Flask)
Chose to keep ML inference in a separate Flask service rather than reimplementing 
the model in Node.js, since Python's ML ecosystem (scikit-learn, SHAP) has no 
mature equivalent in JavaScript. Node/Express handles auth, MongoDB, and app logic; 
Flask handles only prediction. Node forwards prediction requests to Flask via axios 
and returns the response unmodified. This also let ML and backend development 
proceed independently before integration.

## Authentication approach
Implemented signup/login using bcrypt for password hashing (10 salt rounds) and 
JWT for session tokens (7-day expiry). Passwords are never stored in plain text — 
verified directly in MongoDB Atlas that stored passwords appear as bcrypt hashes.

## Database naming
Initial MongoDB connection used the default 'test' database since no database name 
was specified in the connection string. Fixed by adding an explicit database name 
('placement-predictor') to the URI for clarity — MongoDB auto-creates a database 
the first time data is written to it, so no manual creation was needed.

## Secrets management
Database connection string and JWT signing secret are stored in a .env file, 
excluded from git via .gitignore. Rotated the database password after it was 
briefly exposed in plaintext during debugging, as a precaution.

## Node/Flask integration — verified working
Built a POST /api/predict route in Node that forwards incoming requests to the 
Flask API (POST /predict) using axios, and returns the response unchanged. Tested 
end-to-end: request sent to Node correctly reaches Flask, runs through the trained 
model and SHAP explainer, and returns the full response (probability, readiness 
score, strengths, weaknesses) back through Node with no data loss or transformation.

## Dataset switch — MBA to CSE-relevant placement data
The original dataset ("Factors Affecting Campus Placement," benroshan, 215 rows) was 
MBA-specific (fields like mba_p, specialisation_Mkt&HR), which didn't reflect the 
target users of this project (CSE/engineering students) and is a widely-used 
tutorial dataset, weakening claims of an original contribution. Switched to the 
"College Student Placement Factors Dataset" (sahilislam007, Kaggle) — 10,000 rows 
with CSE-relevant features: IQ, Prev_Sem_Result, CGPA, Academic_Performance, 
Internship_Experience, Extra_Curricular_Score, Communication_Skills, 
Projects_Completed.

## Model comparison — synthetic dataset artifact
Random Forest and XGBoost both achieved exactly 100% accuracy and 1.0 ROC-AUC on 
the new dataset, while Logistic Regression achieved 90.4%. Investigation ruled out 
data leakage (no duplicate rows between train/test, no single feature with 
correlation above 0.33 to the target). This pattern strongly suggests the dataset's 
placement labels were generated via a deterministic rule/formula (consistent with 
it being labeled a "Realistic Simulation" dataset by its source), which tree-based 
models can learn exactly, while Logistic Regression's linear decision boundary 
cannot fully capture. Given this, Logistic Regression was retained as the deployed 
model — its more realistic, non-perfect performance is more representative of 
real-world placement prediction, and perfect classifier performance would be 
scientifically indefensible in a viva or research setting.

## Dataset provenance — search for a "real" (non-synthetic) alternative
Investigated whether a genuinely real-world (non-synthetic) placement dataset with 
CSE-relevant features exists publicly. Found that real student outcome data is 
rarely released publicly due to sensitivity, and even well-known datasets in this 
space (e.g., the original benroshan MBA dataset) have unclear provenance. Decided 
to proceed with the current dataset, since its features are appropriate, its 
limitations are well understood and documented, and switching further offered no 
verified improvement over further investigation time spent.

