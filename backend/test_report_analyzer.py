import json
import logging
import warnings
from report_analyzer import MedicalReportAnalyzer

# Suppress warnings for cleaner output
logging.getLogger("transformers").setLevel(logging.ERROR)
warnings.filterwarnings("ignore")

def test_extraction():
    print("Loading analyzer...")
    analyzer = MedicalReportAnalyzer()
    
    sample_text = """
    Patient is a 45-year-old male presenting with severe headache, nausea, and fever. 
    He has a history of hypertension and type 2 diabetes. 
    Doctor prescribed 400mg Ibuprofen for the headache and recommended an MRI of the brain.
    """
    
    # Clean whitespace
    sample_text = " ".join(sample_text.split())
    
    print(f"Cleaned text: {sample_text}")
    print("Analyzing text...")
    
    # Save raw entities
    raw_entities = analyzer.ner_pipeline(sample_text)
    # Convert float32 scores to standard float for JSON serialization
    for ent in raw_entities:
        ent['score'] = float(ent.get('score', 0))
    with open("test_raw.json", "w") as f:
        json.dump(raw_entities, f, indent=4)
        
    results = analyzer.analyze(sample_text)
    
    with open("test_output.json", "w") as f:
        json.dump(results, f, indent=4)
        
    print("Results written to test_output.json and test_raw.json")

if __name__ == "__main__":
    test_extraction()
