# Dataset

## Source
Kaggle — "Placement Prediction Dataset" (ruchikakumbhar)
https://www.kaggle.com/datasets/ruchikakumbhar/placement-prediction-dataset

## Overview
- 10,000 student records
- Target column: `PlacementStatus` (Placed / NotPlaced)
- Class distribution: 5,803 Not Placed, 4,197 Placed (~42% placement rate — well-balanced)

## Original Columns
StudentID, CGPA, Internships, Projects, Workshops/Certifications, AptitudeTestScore, 
SoftSkillsRating, ExtracurricularActivities, PlacementTraining, SSC_Marks, HSC_Marks, 
PlacementStatus

## Cleaning Steps Applied (see clean.py)
1. Dropped `StudentID` — row identifier, not predictive
2. Converted `PlacementStatus` to binary: Placed → 1, NotPlaced → 0
3. Converted `PlacementTraining` to binary: Yes → 1, No → 0
4. Converted `ExtracurricularActivities` to binary: Yes → 1, No → 0
5. No further encoding needed — remaining columns (CGPA, Internships, Projects, 
   Workshops/Certifications, AptitudeTestScore, SoftSkillsRating, SSC_Marks, 
   HSC_Marks) are already numeric

## Final Feature Set (10 features after cleaning)
CGPA, Internships, Projects, Workshops/Certifications, AptitudeTestScore, 
SoftSkillsRating, ExtracurricularActivities, PlacementTraining, SSC_Marks, HSC_Marks

## Assumptions
- No fairness/bias auditing was performed on protected attributes (this dataset 
  does not include gender or other demographic fields, avoiding that concern by design)
- Dataset is a simulated/synthetic dataset representing plausible student profiles 
  and outcomes, not verified real-world survey data (see decisions.md for full 
  dataset selection process and rationale)

## Dataset History
This project used three different datasets during development before settling on 
this one:
1. "Factors Affecting Campus Placement" (benroshan) — MBA-specific, not relevant 
   to target users (CSE students); also a widely-used tutorial dataset
2. "College Student Placement Factors Dataset" (sahilislam007) — CSE-relevant but 
   severely imbalanced (16.6% placement rate), producing unintuitively low scores
3. "Placement Prediction Dataset" (ruchikakumbhar) — current dataset; CSE-relevant, 
   well-balanced (42% placement rate), verified realistic model performance (no 
   suspiciously perfect or uselessly random accuracy)

Full investigation and rationale for each switch documented in decisions.md.