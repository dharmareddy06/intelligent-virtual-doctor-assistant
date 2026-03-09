"""
Medical Report Analyzer
========================
Uses a pre-trained Biomedical NER model (d4data/biomedical-ner-all) from Hugging Face
to extract structured entities from free-text medical reports.

Entity categories extracted:
  - Diseases & Conditions
  - Symptoms & Signs
  - Medications & Drugs
  - Diagnostic Tests / Procedures
  - Body Parts / Anatomical Locations
  - Patient Demographics (Age, Sex)
  - Medical History
  - Severity & Dosage
"""

import re
import logging
from transformers import pipeline

# Suppress verbose HuggingFace logging
logging.getLogger("transformers").setLevel(logging.ERROR)

# ------------------------------------------------------------------
# Label mapping: d4data/biomedical-ner-all  →  human-friendly group
# ------------------------------------------------------------------
LABEL_MAP = {
    "Disease_disorder":     "Diseases_and_Conditions",
    "Sign_symptom":         "Symptoms",
    "Medication":           "Medications",
    "Chemical":             "Medications",
    "Diagnostic_procedure": "Diagnostic_Tests",
    "Lab_value":            "Lab_Values",
    "Biological_structure": "Body_Parts",
    "Anatomical_location":  "Body_Parts",
    "Age":                  "Patient_Demographics",
    "Sex":                  "Patient_Demographics",
    "History":              "Medical_History",
    "Severity":             "Severity",
    "Dosage":               "Dosage",
    "Clinical_event":       "Others",
    "Date":                 "Others",
    "Duration":             "Others",
    "Frequency":            "Others",
    "Family_member":        "Others",
}

# Keys used in the output dict (ordered)
OUTPUT_KEYS = [
    "Diseases_and_Conditions",
    "Symptoms",
    "Medications",
    "Diagnostic_Tests",
    "Lab_Values",
    "Body_Parts",
    "Patient_Demographics",
    "Medical_History",
    "Severity",
    "Dosage",
    "Others",
]


class MedicalReportAnalyzer:
    """Extracts structured medical entities from a plain-text report."""

    def __init__(self, model_name: str = "d4data/biomedical-ner-all"):
        print(f"[MedicalReportAnalyzer] Loading model '{model_name}' …")
        try:
            self.ner = pipeline(
                "token-classification",
                model=model_name,
                aggregation_strategy="simple",  # merge sub-word tokens automatically
            )
            print("[MedicalReportAnalyzer] Model ready.")
        except Exception as exc:
            print(f"[MedicalReportAnalyzer] ERROR loading model: {exc}")
            self.ner = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def analyze(self, text: str) -> dict:
        """
        Analyzes a medical report string and returns structured entities.

        Parameters
        ----------
        text : str
            Free-text medical report.

        Returns
        -------
        dict
            Keys are entity categories; values are lists of
            {'text', 'label', 'confidence'} dicts.
        """
        if not self.ner:
            return {"error": "NER model not loaded."}
        if not text or not isinstance(text, str):
            return {"error": "Input must be a non-empty string."}

        # --- Pre-process: collapse whitespace so the model sees clean text ---
        clean_text = " ".join(text.split())

        # --- Run NER ---
        raw_entities = self.ner(clean_text)

        # --- Build output skeleton ---
        result: dict = {k: [] for k in OUTPUT_KEYS}
        seen: dict = {k: set() for k in OUTPUT_KEYS}  # dedup per category

        for ent in raw_entities:
            word = re.sub(r"##", "", ent.get("word", "")).strip()
            if not word:
                continue

            # Map the model's label to our friendly category
            raw_label = ent.get("entity_group", ent.get("entity", ""))
            raw_label_clean = raw_label.lstrip("B-").lstrip("I-")
            category = LABEL_MAP.get(raw_label_clean, "Others")

            confidence = round(float(ent.get("score", 0.0)), 4)
            word_lower = word.lower()

            # Keep highest-confidence occurrence
            if word_lower in seen[category]:
                # Find existing entry and update if better
                for item in result[category]:
                    if item["text"].lower() == word_lower:
                        if confidence > item["confidence"]:
                            item["confidence"] = confidence
                        break
            else:
                seen[category].add(word_lower)
                result[category].append({
                    "text": word,
                    "label": raw_label_clean,
                    "confidence": confidence,
                })

        # Sort each list by confidence descending
        for key in result:
            result[key].sort(key=lambda x: x["confidence"], reverse=True)

        return result

    def summary(self, text: str) -> str:
        """Returns a human-readable one-line summary of the report."""
        data = self.analyze(text)
        if "error" in data:
            return data["error"]

        parts = []
        if data["Patient_Demographics"]:
            demo = [d["text"] for d in data["Patient_Demographics"]]
            parts.append("Patient: " + ", ".join(demo))
        if data["Symptoms"]:
            syms = [s["text"] for s in data["Symptoms"]]
            parts.append("Symptoms: " + ", ".join(syms))
        if data["Diseases_and_Conditions"]:
            dis = [d["text"] for d in data["Diseases_and_Conditions"]]
            parts.append("Conditions: " + ", ".join(dis))
        if data["Medications"]:
            meds = [m["text"] for m in data["Medications"]]
            parts.append("Medications: " + ", ".join(meds))
        if data["Diagnostic_Tests"]:
            tests = [t["text"] for t in data["Diagnostic_Tests"]]
            parts.append("Tests: " + ", ".join(tests))

        return " | ".join(parts) if parts else "No key entities identified."


# ------------------------------------------------------------------
# Quick standalone test
# ------------------------------------------------------------------
if __name__ == "__main__":
    import json

    analyzer = MedicalReportAnalyzer()

    samples = [
        (
            "Sample 1 – General",
            "Patient is a 45-year-old male presenting with severe headache, nausea, and fever. "
            "He has a history of hypertension and type 2 diabetes. "
            "Doctor prescribed 400 mg Ibuprofen for the headache and recommended an MRI of the brain."
        ),
        (
            "Sample 2 – Cardiology",
            "67-year-old female with chest pain, shortness of breath, and palpitations. "
            "ECG shows ST-elevation. Troponin levels elevated. Diagnosed with acute myocardial infarction. "
            "Started on Aspirin 81 mg, Heparin infusion, and referred for coronary angiography."
        ),
        (
            "Sample 3 – General Prescription",
            "Patient reports persistent cough and sore throat for 5 days. "
            "Diagnosed with pharyngitis. Prescribed Amoxicillin 500 mg three times daily for 7 days. "
            "Advised to get a throat swab culture."
        ),
    ]

    for title, text in samples:
        print(f"\n{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}")
        result = analyzer.analyze(text)
        print(json.dumps(result, indent=2))
        print(f"\n  Summary -> {analyzer.summary(text)}")
