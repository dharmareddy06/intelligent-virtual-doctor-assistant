import React, { useState, useRef } from 'react';
import {
    FileText,
    Upload,
    X,
    Loader2,
    AlertTriangle,
    ArrowLeft,
    Clock,
    FileWarning,
    Info,
    Activity,
    CheckCircle,
    User
} from 'lucide-react';
import { Button } from '../components/common/Button';

interface AbnormalValue {
    marker: string;
    value: string;
    normalRange: string;
    significance: string;
}

interface ReportResult {
    patientInfo?: { name?: string; age?: string; gender?: string };
    reportDate?: string;
    reportType?: string;
    summary: string;
    keyFindings: string[];
    abnormalValues?: AbnormalValue[];
    recommendations?: string[];
    disclaimer?: string;
}

export const MedicalReportAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ReportResult | null>(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
            setError('Please upload an image file (JPG, PNG) or PDF');
            return;
        }
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            // Display a generic PDF icon/preview or simply the filename
            setPreview('pdf');
        }
        setError('');
        setResult(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please upload a medical report');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Mock API scan
            setTimeout(() => {
                setResult({
                    summary: "The medical report indicates mildly elevated cholesterol levels but otherwise normal findings. No immediate critical issues detected.",
                    reportType: "Comprehensive Blood Panel",
                    patientInfo: { name: "John Doe" },
                    reportDate: "2026-03-09",
                    keyFindings: [
                        "Hemoglobin is within normal limits.",
                        "Blood glucose level is normal.",
                        "Total cholesterol is slightly above the recommended range."
                    ],
                    abnormalValues: [
                        {
                            marker: "LDL Cholesterol",
                            value: "135 mg/dL",
                            normalRange: "< 100 mg/dL",
                            significance: "Borderline high. May increase risk of cardiovascular issues over time."
                        }
                    ],
                    recommendations: [
                        "Consider dietary changes to reduce saturated fats and cholesterol intake.",
                        "Increase cardiovascular exercise to 150 minutes per week.",
                        "Follow up with your primary care physician in 3-6 months for a recheck."
                    ]
                });
                setLoading(false);
            }, 2000);
        } catch (err) {
            setError('Failed to analyze the report.');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--surface-background)]">
            {/* Hero */}
            <section className="pt-20 pb-12 px-4 text-center bg-[var(--surface-white)] border-b border-[var(--border-light)]">
                <div className="container max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-sm font-medium mb-6 border border-[var(--primary-100)]">
                        <FileText size={16} />
                        <span>AI Medical Report Analyzer</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--secondary-900)] mb-4 tracking-tight">
                        Upload your medical report, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-400)]">understand your health</span>
                    </h1>
                    <p className="text-lg text-[var(--secondary-500)] max-w-2xl mx-auto">
                        Our AI reads your lab results and medical reports, translating complex medical jargon into easy-to-understand explanations and insights.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-10 px-4 flex-1">
                <div className="container max-w-4xl mx-auto">

                    {!result ? (
                        <div className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                    <AlertTriangle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Upload Zone */}
                            <div
                                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${dragOver ? 'border-[var(--primary-500)] bg-[var(--primary-50)]' : preview ? 'border-[var(--primary-300)] bg-[var(--surface-card)]' : 'border-[var(--border-medium)] bg-[var(--surface-card)] hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)]/30'}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => !preview && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                />

                                {preview ? (
                                    <div className="p-6">
                                        <div className="relative rounded-xl overflow-hidden bg-[var(--secondary-50)] flex items-center justify-center min-h-[200px]">
                                            {preview === 'pdf' ? (
                                                <div className="flex flex-col items-center gap-4 text-[var(--secondary-500)] py-12">
                                                    <FileText size={64} className="text-[var(--primary-400)]" />
                                                    <span className="font-medium">PDF Document Selected</span>
                                                </div>
                                            ) : (
                                                <img src={preview} alt="Report preview" className="w-full max-h-[400px] object-contain" />
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); resetForm(); }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-[var(--secondary-600)]">
                                                <CheckCircle size={16} className="text-[var(--primary-600)]" />
                                                <span>{file?.name}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                className="text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                                            >
                                                Change document
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 px-6 cursor-pointer">
                                        <div className="w-20 h-20 bg-[var(--primary-50)] rounded-full flex items-center justify-center mb-6 text-[var(--primary-600)]">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--secondary-900)] mb-2">Upload Medical Report</h3>
                                        <p className="text-[var(--secondary-500)] text-center max-w-md mb-4">
                                            Drag and drop your report here, or click to browse your files
                                        </p>
                                        <p className="text-xs text-[var(--secondary-400)]">Supports JPG, PNG, WEBP, PDF • Max 10MB</p>
                                    </div>
                                )}
                            </div>

                            {preview && (
                                <div className="flex justify-end">
                                    <Button size="lg" icon={FileText} onClick={handleSubmit} disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            'Analyze Report'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-4 border-[var(--primary-100)] flex items-center justify-center">
                                            <Loader2 size={36} className="animate-spin text-[var(--primary-600)]" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)]">Analyzing your report...</h3>
                                    <p className="text-[var(--secondary-500)] text-sm">AI is extracting clinical findings and interpreting results</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Report Header */}
                            <div className="flex items-center justify-between p-5 bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--secondary-900)] text-xl">
                                            {result.reportType || 'Report Analysis Complete'}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--secondary-500)] mt-1">
                                            {result.patientInfo?.name && (
                                                <span className="flex items-center gap-1"><User size={14} /> {result.patientInfo.name}</span>
                                            )}
                                            {result.reportDate && (
                                                <span className="flex items-center gap-1"><Clock size={14} /> {result.reportDate}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-[var(--surface-white)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-3 flex items-center gap-2">
                                    <Activity size={20} className="text-[var(--primary-600)]" />
                                    Overall Summary
                                </h3>
                                <p className="text-[var(--secondary-600)] leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>

                            {/* Key Findings */}
                            {result.keyFindings && result.keyFindings.length > 0 && (
                                <div className="bg-[var(--surface-white)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <CheckCircle size={20} className="text-green-600" />
                                        Key Findings
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.keyFindings.map((finding, idx) => (
                                            <li key={idx} className="flex flex-start gap-3 text-[var(--secondary-600)]">
                                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                                                <span>{finding}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Abnormal Values */}
                            {result.abnormalValues && result.abnormalValues.length > 0 && (
                                <div className="bg-[var(--surface-white)] border border-red-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <AlertTriangle size={20} className="text-red-500" />
                                        Abnormal Results to Watch
                                    </h3>
                                    <div className="space-y-4">
                                        {result.abnormalValues.map((av, idx) => (
                                            <div key={idx} className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                                                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <span className="text-sm font-medium text-red-800">Marker</span>
                                                        <p className="font-bold text-[var(--secondary-900)]">{av.marker}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-red-800">Value (Normal: {av.normalRange})</span>
                                                        <p className="font-bold text-red-600">{av.value}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-3 border-t border-red-100">
                                                    <span className="text-sm font-medium text-red-800">What this means:</span>
                                                    <p className="text-sm text-[var(--secondary-600)] mt-1">{av.significance}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {result.recommendations && result.recommendations.length > 0 && (
                                <div className="bg-[var(--surface-white)] border border-blue-200 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <Info size={20} className="text-blue-600" />
                                        Recommendations
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex flex-start gap-3 p-3 bg-blue-50/50 rounded-lg text-blue-900 text-sm">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                                    {idx + 1}
                                                </div>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                                <FileWarning size={18} className="flex-shrink-0 mt-0.5" />
                                <p>{result.disclaimer || 'This is an AI-generated analysis of your medical report. It is not a clinical diagnosis. Always consult with your healthcare provider for medical advice.'}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                                <Button variant="secondary" icon={ArrowLeft} onClick={resetForm}>
                                    Analyze Another Report
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
