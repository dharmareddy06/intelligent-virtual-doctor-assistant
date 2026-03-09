"""
Flask API for the Intelligent Virtual Doctor Assistant
======================================================

Endpoints:
  POST /api/analyze-report   –  Analyze a medical report text
  GET  /api/health           –  Health check
"""

import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

from report_analyzer import MedicalReportAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow requests from the React frontend

# Lazy-load the analyzer once at startup
logger.info("Initializing MedicalReportAnalyzer …")
analyzer = MedicalReportAnalyzer()
logger.info("Analyzer ready.")


# ------------------------------------------------------------------ #
#  Health Check
# ------------------------------------------------------------------ #
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "d4data/biomedical-ner-all"}), 200


# ------------------------------------------------------------------ #
#  Medical Report Analysis
# ------------------------------------------------------------------ #
@app.route("/api/analyze-report", methods=["POST"])
def analyze_report():
    """
    Accepts JSON: { "text": "<medical report text>" }
    Returns structured entity extraction results.
    """
    data = request.get_json(silent=True)

    if not data or "text" not in data:
        return jsonify({"error": "Request body must contain a 'text' field."}), 400

    text = data["text"].strip()
    if not text:
        return jsonify({"error": "The 'text' field must not be empty."}), 400

    logger.info(f"Analyzing report ({len(text)} chars) …")

    result = analyzer.analyze(text)
    summary = analyzer.summary(text)

    response = {
        "entities": result,
        "summary": summary,
        "char_count": len(text),
    }
    return jsonify(response), 200


# ------------------------------------------------------------------ #
#  Entry Point
# ------------------------------------------------------------------ #
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
