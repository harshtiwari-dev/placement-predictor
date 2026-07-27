# Dataset

## Source
Kaggle — "Factors Affecting Campus Placement" (benroshan)
https://www.kaggle.com/datasets/benroshan/factors-affecting-campus-placement

## Overview
- 215 student records
- Target column: `status` (Placed / Not Placed)
- Class distribution: 148 Placed, 67 Not Placed (~69% placement rate)

## Original Columns
sl_no, gender, ssc_p, ssc_b, hsc_p, hsc_b, hsc_s, degree_p, degree_t, workex, 
etest_p, specialisation, mba_p, status, salary

## Cleaning Steps Applied (see clean.py)
1. Dropped `sl_no` — row identifier, not predictive
2. Dropped `salary` — only populated for placed students; using it as a feature 
   would leak the answer (data leakage)
3. Converted `status` to binary: Placed → 1, Not Placed → 0
4. One-hot encoded categorical columns (`gender`, `ssc_b`, `hsc_b`, `hsc_s`, 
   `degree_t`, `workex`, `specialisation`) with `drop_first=True` to avoid 
   redundant columns
5. Cast resulting boolean (True/False) columns to integers (0/1) — required for 
   SHAP compatibility (see decisions.md)

## Final Feature Set (14 features after cleaning)
ssc_p, hsc_p, degree_p, etest_p, mba_p, gender_M, ssc_b_Others, hsc_b_Others, 
hsc_s_Commerce, hsc_s_Science, degree_t_Others, degree_t_Sci&Tech, workex_Yes, 
specialisation_Mkt&HR

## Assumptions
- Baseline categories dropped during one-hot encoding are assumed as the default 
  when all corresponding dummy columns are 0 (e.g., if hsc_s_Commerce=0 and 
  hsc_s_Science=0, stream is assumed to be Arts)
- Dataset reflects historical placement outcomes; no explicit fairness/bias 
  auditing was performed on protected attributes like gender (noted as a 
  limitation, potential future work)