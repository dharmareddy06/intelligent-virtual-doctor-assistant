import React from 'react';
import { MessageSquare, Cpu, FileText, CheckCircle, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
    const symptomSteps = [
        {
            id: 1,
            icon: MessageSquare,
            title: "Describe Your Symptoms",
            description: "Tell us what you're feeling in your own words. Add your age, gender, and how long you've had symptoms for more accurate results."
        },
        {
            id: 2,
            icon: Cpu,
            title: "AI Analyzes",
            description: "Our advanced AI processes your symptoms against medical knowledge to identify possible conditions and assess severity."
        },
        {
            id: 3,
            icon: FileText,
            title: "Get Your Results",
            description: "Receive a detailed report with possible conditions, severity level, recommendations, home remedies, and when to see a doctor."
        }
    ];

    const reportSteps = [
        {
            id: 1,
            icon: FileText,
            title: "Upload Medical Report",
            description: "Take a clear photo or upload a PDF of your medical report. Our AI accepts lab results, imaging reports, and more."
        },
        {
            id: 2,
            icon: Cpu,
            title: "AI Analyzes Data",
            description: "Our AI reads your medical report, extracting key findings, abnormal values, and translating complex medical terminology into plain English."
        },
        {
            id: 3,
            icon: FileText,
            title: "Understand Your Health",
            description: "Get a clear breakdown of your test results, understand what each value means for your health, and receive actionable insights."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--surface-background)]">
            {/* Hero Section */}
            <section className="pt-20 pb-16 text-center px-4 bg-[var(--surface-white)] border-b border-[var(--border-light)]">
                <div className="container max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-100)] text-[var(--secondary-600)] text-sm font-medium mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-[var(--secondary-400)]"></span>
                        <span>Simple Process</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--secondary-900)] mb-6 tracking-tight">
                        Health guidance in <span className="text-[var(--primary-600)]">three simple steps</span>
                    </h1>
                    <p className="text-lg text-[var(--secondary-500)] leading-relaxed">
                        Whether you're describing symptoms or analyzing a medical report, getting AI-powered health insights has never been easier.
                    </p>
                </div>
            </section>

            {/* Symptom Checker Flow */}
            <section className="py-20 px-4">
                <div className="container max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4 border border-blue-100">
                            <Stethoscope size={16} />
                            <span>Symptom Checker</span>
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--secondary-900)]">Don't have a prescription?</h2>
                        <p className="text-[var(--secondary-500)] mt-2">Just tell us what you're feeling</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {symptomSteps.map((step, index) => (
                            <div key={step.id} className="relative">
                                {index < symptomSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-blue-200">
                                        <ArrowRight size={16} className="absolute -right-2 -top-2 text-blue-300" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 text-blue-600 flex items-center justify-center mb-6 relative">
                                        <step.icon size={36} />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            {step.id}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--secondary-900)] mb-3">{step.title}</h3>
                                    <p className="text-[var(--secondary-500)] leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/symptoms">
                            <Button size="lg" icon={Stethoscope} className="bg-blue-600 hover:bg-blue-700">Try Symptom Checker</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="container max-w-lg mx-auto px-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[var(--border-light)]"></div>
                    <span className="text-sm font-bold text-[var(--secondary-400)] uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-[var(--border-light)]"></div>
                </div>
            </div>

            {/* Medical Report Analyzer Flow */}
            <section className="py-20 px-4">
                <div className="container max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-sm font-medium mb-4 border border-[var(--primary-100)]">
                            <FileText size={16} />
                            <span>Medical Report Analyzer</span>
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--secondary-900)]">Have a medical report?</h2>
                        <p className="text-[var(--secondary-500)] mt-2">Upload it and let AI explain your results</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {reportSteps.map((step, index) => (
                            <div key={step.id} className="relative">
                                {index < reportSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-[var(--primary-200)]">
                                        <ArrowRight size={16} className="absolute -right-2 -top-2 text-[var(--primary-300)]" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-[var(--primary-50)] border-4 border-[var(--primary-100)] text-[var(--primary-600)] flex items-center justify-center mb-6 relative">
                                        <step.icon size={36} />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--primary-600)] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            {step.id}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--secondary-900)] mb-3">{step.title}</h3>
                                    <p className="text-[var(--secondary-500)] leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/report">
                            <Button size="lg" icon={FileText}>Analyze a Report</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trust/Safety Banner */}
            <section className="py-16 bg-[var(--primary-900)] text-white px-4">
                <div className="container max-w-4xl text-center">
                    <div className="w-16 h-16 mx-auto bg-[var(--primary-800)] rounded-full flex items-center justify-center mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Your Privacy comes first</h2>
                    <p className="text-[var(--primary-100)] text-lg mb-8 max-w-2xl mx-auto">
                        We do not store your prescription images or symptom data beyond your session. All AI processing is done securely, and your personal health information remains under your control.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/symptoms">
                            <Button size="lg" className="bg-white text-[var(--primary-900)] hover:bg-[var(--primary-50)] border-none shadow-lg">
                                Check Symptoms
                            </Button>
                        </Link>
                        <Link to="/report">
                            <Button size="lg" className="bg-[var(--primary-700)] text-white hover:bg-[var(--primary-600)] border-none shadow-lg">
                                Analyze Report
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
