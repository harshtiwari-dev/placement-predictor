## SHAP + numpy compatibility issue
Encountered a TypeError when running shap.plots.beeswarm() due to boolean (True/False) 
columns from one-hot encoding being incompatible with numpy's rounding function in 
this SHAP version. Fixed by explicitly casting all boolean columns to integers (0/1) 
in clean.py after encoding.