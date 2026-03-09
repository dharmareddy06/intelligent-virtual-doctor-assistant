import React, { useState, useEffect, useRef } from 'react';
import {
    Stethoscope,
    User,
    Clock,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Activity,
    Heart,
    ShieldAlert,
    Home,
    Pill,
    Info,
    Search,
    X,
    Apple,
    Lightbulb,
    Tag
} from 'lucide-react';
import { Button } from '../components/common/Button';
import symptomsData from '../data/symptoms_database.json';

interface Condition {
    name: string;
    likelihood: string;
    description: string;
}

interface AnalysisResult {
    possibleConditions: Condition[];
    diseaseType: string;
    severity: string;
    severityExplanation: string;
    prescriptions: string[];
    foodRecommendations: string[];
    generalAdvice: string[];
    recommendations: string[];
    homeRemedies: string[];
    whenToSeeDoctor: string;
    urgentCare: boolean;
    disclaimer: string;
}

export const SymptomChecker: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
    const [symptomsLoading, setSymptomsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [duration, setDuration] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [userCondition, setUserCondition] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load unique symptoms from database
        const symptomsSet = new Set<string>();
        symptomsData.diseases.forEach(disease => {
            disease.symptoms.forEach(s => symptomsSet.add(s));
        });
        setAllSymptoms(Array.from(symptomsSet).sort());
        setSymptomsLoading(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSymptoms = allSymptoms.filter(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedSymptoms.includes(s)
    );

    const addSymptom = (symptom: string) => {
        if (!selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(prev => [...prev, symptom]);
        }
        setSearchQuery('');
        inputRef.current?.focus();
    };

    const removeSymptom = (symptom: string) => {
        setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    };

    const handleSubmit = async () => {
        if (selectedSymptoms.length === 0 && !userCondition.trim()) {
            setError('Please select at least one symptom or enter a condition');
            return;
        }
        setError('');
        setLoading(true);
        setStep(2);

        try {
            setTimeout(() => {
                // Simple matching algorithm
                let bestMatch = symptomsData.diseases[0];
                let maxScore = -1;

                symptomsData.diseases.forEach(disease => {
                    let score = 0;

                    // Match by Condition Name (highest priority)
                    if (userCondition && disease.name.toLowerCase().includes(userCondition.toLowerCase())) {
                        score += 100;
                    }

                    // Match by symptoms
                    selectedSymptoms.forEach(s => {
                        if (disease.symptoms.includes(s)) {
                            score += 10;
                        }
                    });

                    if (score > maxScore) {
                        maxScore = score;
                        bestMatch = disease;
                    }
                });

                // If practically no match was found but condition was typed, fallback nicely
                if (maxScore === 0) {
                    setResult({
                        diseaseType: "Unknown",
                        severity: "Unknown",
                        severityExplanation: "Could not find a perfect match in our database.",
                        possibleConditions: [
                            { name: userCondition || "Unknown Condition", likelihood: "Low", description: "No matching data found." }
                        ],
                        prescriptions: [],
                        foodRecommendations: [],
                        generalAdvice: ["Please consult a healthcare professional for accurate diagnosis."],
                        recommendations: ["Seek medical attention."],
                        homeRemedies: [],
                        whenToSeeDoctor: "If symptoms persist or worsen.",
                        urgentCare: false,
                        disclaimer: "This analysis is based on limited data."
                    });
                } else {
                    setResult({
                        diseaseType: "General Match",
                        severity: "Moderate",
                        severityExplanation: "Based on matched symptoms.",
                        possibleConditions: [
                            { name: bestMatch.name, likelihood: "High", description: `Matched ${maxScore} points based on your input.` }
                        ],
                        prescriptions: bestMatch.medicines,
                        foodRecommendations: bestMatch.diet_plan.foods_to_take,
                        generalAdvice: bestMatch.diet_plan.foods_to_avoid.map(f => `Avoid: ${f}`),
                        recommendations: [bestMatch.diet_plan.advice],
                        homeRemedies: [],
                        whenToSeeDoctor: "If symptoms worsen or do not improve with basic care.",
                        urgentCare: false,
                        disclaimer: "This is an AI-generated analysis. Always verify with your doctor."
                    });
                }

                setStep(3);
                setLoading(false);
            }, 1000);
        } catch {
            setError('Failed to analyze symptoms.');
            setStep(1);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setSelectedSymptoms([]);
        setSearchQuery('');
        setAge('');
        setGender('');
        setDuration('');
        setAdditionalInfo('');
        setUserCondition('');
        setResult(null);
        setError('');
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'mild': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
            case 'moderate': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' };
            case 'severe': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--surface-background)]">
            {/* Hero */}
            <section className="pt-20 pb-12 px-4 text-center bg-[var(--surface-white)] border-b border-[var(--border-light)]">
                <div className="container max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
                        <Stethoscope size={16} />
                        <span>AI Symptom Analysis</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--secondary-900)] mb-4 tracking-tight">
                        Select your symptoms, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[var(--primary-500)]">get complete diagnosis</span>
                    </h1>
                    <p className="text-lg text-[var(--secondary-500)] max-w-2xl mx-auto">
                        Our medical AI finds diseases, recommends medicines, suggests foods, and provides personalized health advice.
                    </p>
                </div>
            </section>

            {/* Progress Bar */}
            <div className="container max-w-3xl mx-auto px-4 pt-8">
                <div className="flex items-center justify-between mb-2">
                    {['Select Symptoms', 'AI Analysis', 'Your Results'].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > i + 1 ? 'bg-[var(--primary-600)] text-white' : step === i + 1 ? 'bg-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-600)]/25' : 'bg-[var(--secondary-100)] text-[var(--secondary-400)]'}`}>
                                {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                            </div>
                            <span className={`hidden sm:block text-sm font-medium ${step >= i + 1 ? 'text-[var(--secondary-900)]' : 'text-[var(--secondary-400)]'}`}>{label}</span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-[var(--secondary-100)] rounded-full h-1.5 mt-4">
                    <div
                        className="bg-[var(--primary-600)] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${((step) / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <section className="py-8 px-4 flex-1">
                <div className="container max-w-3xl mx-auto">

                    {/* Step 1: Input */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in">
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                    <AlertTriangle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}



                            {/* 2-Column Layout */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Column 1: Symptom Selection */}
                                <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <label className="block text-lg font-bold text-[var(--secondary-900)] mb-2">
                                        Symptoms
                                    </label>
                                    <p className="text-sm text-[var(--secondary-500)] mb-4">Select your symptoms.</p>

                                    {symptomsLoading ? (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Loading symptoms...</span>
                                        </div>
                                    ) : (
                                        <>
                                            {selectedSymptoms.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {selectedSymptoms.map(symptom => (
                                                        <span
                                                            key={symptom}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[var(--primary-100)] text-[var(--primary-700)] border border-[var(--primary-200)]"
                                                        >
                                                            {symptom}
                                                            <button
                                                                onClick={() => removeSymptom(symptom)}
                                                                className="hover:bg-[var(--primary-200)] rounded-full p-0.5 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <button
                                                        onClick={() => setSelectedSymptoms([])}
                                                        className="text-xs text-[var(--secondary-500)] hover:text-red-600 transition-colors px-2 py-1"
                                                    >
                                                        Clear all
                                                    </button>
                                                </div>
                                            )}

                                            <div className="relative" ref={dropdownRef}>
                                                <div className="relative">
                                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-400)]" />
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            setShowDropdown(true);
                                                        }}
                                                        onFocus={() => setShowDropdown(true)}
                                                        placeholder="Search symptoms..."
                                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] placeholder-[var(--secondary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                                    />
                                                </div>

                                                {showDropdown && (
                                                    <div className="absolute z-50 w-full mt-2 bg-[var(--surface-card)] border border-[var(--border-light)] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredSymptoms.length > 0 ? (
                                                            filteredSymptoms.slice(0, 50).map(symptom => (
                                                                <button
                                                                    key={symptom}
                                                                    onClick={() => {
                                                                        addSymptom(symptom);
                                                                        setShowDropdown(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 hover:bg-[var(--primary-50)] text-[var(--secondary-700)] hover:text-[var(--primary-700)] transition-colors text-sm border-b border-[var(--border-light)] last:border-b-0"
                                                                >
                                                                    {symptom}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-sm text-[var(--secondary-400)]">
                                                                No matching symptoms found
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xs text-[var(--secondary-400)] mt-2">
                                                {allSymptoms.length} symptoms available · {selectedSymptoms.length} selected
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Column 2: User Condition */}
                                <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <label className="block text-lg font-bold text-[var(--secondary-900)] mb-2">
                                        Known Condition
                                    </label>
                                    <p className="text-sm text-[var(--secondary-500)] mb-4">If you already know your condition, type it here.</p>
                                    <input
                                        type="text"
                                        value={userCondition}
                                        onChange={(e) => setUserCondition(e.target.value)}
                                        placeholder="e.g., Asthma, Migraine..."
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] placeholder-[var(--secondary-400)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4">Additional Information (Optional)</h3>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-600)] mb-2">
                                            <User size={14} /> Age
                                        </label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="25"
                                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-600)] mb-2">
                                            <Heart size={14} /> Gender
                                        </label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-600)] mb-2">
                                            <Clock size={14} /> Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="e.g., 3 days"
                                            className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--secondary-600)] mb-2">
                                        <Info size={14} /> Additional Details
                                    </label>
                                    <input
                                        type="text"
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                        placeholder="e.g., existing conditions, medications, allergies..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-background)] text-[var(--secondary-900)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button size="lg" icon={ArrowRight} onClick={handleSubmit}>
                                    Analyze Symptoms
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Loading */}
                    {step === 2 && loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-[var(--primary-100)] flex items-center justify-center">
                                    <Loader2 size={40} className="animate-spin text-[var(--primary-600)]" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[var(--primary-600)] rounded-full flex items-center justify-center shadow-lg">
                                    <Activity size={16} className="text-white" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-[var(--secondary-900)] mb-2">Analyzing your symptoms...</h3>
                                <p className="text-[var(--secondary-500)]">Our AI is predicting conditions, medicines, and personalized recommendations</p>
                            </div>
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-3 h-3 rounded-full bg-[var(--primary-500)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Results */}
                    {step === 3 && result && (
                        <div className="space-y-6">
                            {/* Urgent Care Alert */}
                            {result.urgentCare && (
                                <div className="flex items-start gap-4 p-5 bg-red-50 border-2 border-red-200 rounded-2xl">
                                    <ShieldAlert size={28} className="text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-red-800 text-lg">Seek Medical Attention</h3>
                                        <p className="text-red-700 mt-1">{result.whenToSeeDoctor}</p>
                                    </div>
                                </div>
                            )}

                            {/* Disease Type & Severity */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Disease Type Badge */}
                                <div className="flex items-center gap-4 p-5 rounded-2xl border bg-purple-50 border-purple-200">
                                    <Tag size={22} className="text-purple-600 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Disease Type</span>
                                        <p className="text-sm font-bold text-purple-800 mt-0.5">{result.diseaseType}</p>
                                    </div>
                                </div>

                                {/* Severity Badge */}
                                <div className={`flex items-center gap-4 p-5 rounded-2xl border ${getSeverityColor(result.severity).bg} ${getSeverityColor(result.severity).border}`}>
                                    <div className={`w-4 h-4 rounded-full ${getSeverityColor(result.severity).dot} animate-pulse`} />
                                    <div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${getSeverityColor(result.severity).text}`}>
                                            Severity: {result.severity}
                                        </span>
                                        <p className={`text-sm mt-0.5 ${getSeverityColor(result.severity).text} opacity-80`}>
                                            {result.severityExplanation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Possible Conditions */}
                            <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                    <Stethoscope size={20} className="text-[var(--primary-600)]" />
                                    Predicted Conditions
                                </h3>
                                <div className="space-y-3">
                                    {result.possibleConditions?.map((condition, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-[var(--surface-background)] rounded-xl border border-[var(--border-light)]">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-[var(--secondary-900)]">{condition.name}</h4>
                                                    {/* <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getLikelihoodColor(condition.likelihood)}`}>
                                                        {condition.likelihood}
                                                    </span> */}
                                                </div>
                                                {/* <p className="text-sm text-[var(--secondary-500)]">{condition.description}</p> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Medicine / Drug Prescription */}
                            {result.prescriptions && result.prescriptions.length > 0 && (
                                <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <Pill size={20} className="text-blue-600" />
                                        Suggested Medicines / Drugs
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.prescriptions.map((drug, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200"
                                            >
                                                <Pill size={14} className="mr-2 text-blue-500" />
                                                {drug}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-[var(--secondary-400)] mt-3 italic">
                                        ⚠️ These are AI suggestions from medical databases. Always consult a doctor before taking any medication.
                                    </p>
                                </div>
                            )}

                            {/* Food Recommendations & General Advice — side by side */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Food Recommendations */}
                                <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <Apple size={20} className="text-green-600" />
                                        Food Recommendations
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.foodRecommendations?.map((food, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[var(--secondary-700)] text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                                {food}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* General Advice */}
                                <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                        <Lightbulb size={20} className="text-amber-500" />
                                        General Advice
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.generalAdvice?.map((advice, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[var(--secondary-700)] text-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                                {advice}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-[var(--secondary-900)] mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-[var(--primary-600)]" />
                                    Medical Recommendations
                                </h3>
                                <ul className="space-y-3">
                                    {result.recommendations?.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[var(--secondary-700)] text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary-500)] mt-1.5 flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* When to See Doctor */}
                            {!result.urgentCare && result.whenToSeeDoctor && (
                                <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                                    <Home size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-blue-800">When to See a Doctor</h3>
                                        <p className="text-blue-700 text-sm mt-1">{result.whenToSeeDoctor}</p>
                                    </div>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                                <p>{result.disclaimer}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button variant="secondary" icon={ArrowLeft} onClick={resetForm}>
                                    Check New Symptoms
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
