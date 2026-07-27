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