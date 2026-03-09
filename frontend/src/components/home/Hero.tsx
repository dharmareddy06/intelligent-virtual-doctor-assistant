import React from 'react';
import { Button } from '../common/Button';
import { ArrowRight, ShieldCheck, Zap, Stethoscope, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
            <div className="container relative z-10 max-w-6xl">
                <div className="flex flex-col gap-12 items-center">

                    {/* Text Content */}
                    <div className="flex flex-col gap-8 w-full text-center items-center max-w-4xl mx-auto pt-8">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-50)] border border-[var(--primary-200)] text-[var(--primary-800)] text-sm font-semibold tracking-wide shadow-sm mb-2 hover:bg-[var(--primary-100)] transition-colors cursor-pointer">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--primary-500)] animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                            <span>Next-Gen Healthcare AI</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[var(--secondary-900)] leading-[1.15]">
                            AI-Powered Healthcare <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-600)] to-blue-400">
                                At Your Fingertips
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-[var(--secondary-600)] leading-relaxed max-w-3xl font-medium">
                            Instant symptom analysis, accurate medical report explanations, and personalized health guidance—available 24/7. Your trusted health companion.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-5 justify-center w-full mt-4">
                            <Link to="/symptoms">
                                <Button size="lg" icon={Stethoscope} className="w-full sm:w-auto text-lg px-8 py-4 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)]">
                                    Check Symptoms
                                </Button>
                            </Link>
                            {/* <Link to="/report">
                                <Button variant="secondary" size="lg" icon={FileText} className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-[var(--border-medium)] hover:border-[var(--primary-400)]">
                                    Analyze Report
                                </Button>
                            </Link> */}
                        </div>

                        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-[var(--secondary-600)] text-md font-medium px-4">
                            <div className="flex items-center gap-2 bg-[var(--surface-white)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-light)] transform hover:-translate-y-1 transition duration-300">
                                <ShieldCheck size={20} className="text-[var(--primary-600)]" />
                                <span>Private & Secure</span>
                            </div>
                            <div className="flex items-center gap-2 bg-[var(--surface-white)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-light)] transform hover:-translate-y-1 transition duration-300">
                                <Zap size={20} className="text-[var(--primary-600)]" />
                                <span>Instant Results</span>
                            </div>
                            <div className="flex items-center gap-2 bg-[var(--surface-white)] px-4 py-2 rounded-xl shadow-sm border border-[var(--border-light)] transform hover:-translate-y-1 transition duration-300">
                                <Activity size={20} className="text-[var(--primary-600)]" />
                                <span>AI Powered</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual/Card Area (Moved below as a wide feature showcase) */}
                    <div className="relative w-full mt-8 max-w-5xl mx-auto">
                        {/* Background decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--primary-100)] rounded-[100%] blur-3xl opacity-40 animate-pulse pointer-events-none"></div>

                        <div className="relative grid md:grid-cols-2 gap-6 z-10 w-full mb-12">
                            {/* Symptom Checker Card */}
                            <Link to="/symptoms" className="group">
                                <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] shadow-lg p-6 hover:shadow-xl hover:border-[var(--primary-200)] transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Stethoscope size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[var(--secondary-900)] text-lg mb-1">Symptom Checker</h3>
                                            <p className="text-sm text-[var(--secondary-500)]">Describe what you're feeling and get AI-powered analysis of possible conditions, severity, and recommendations.</p>
                                            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600">
                                                <span>Start checking</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Medical Report Analyzer Card */}
                            {/* <Link to="/report" className="group">
                                <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] shadow-lg p-6 hover:shadow-xl hover:border-[var(--primary-200)] transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-[var(--primary-50)] rounded-xl flex items-center justify-center text-[var(--primary-600)] flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <FileText size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[var(--secondary-900)] text-lg mb-1">Medical Report Analyzer</h3>
                                            <p className="text-sm text-[var(--secondary-500)]">Upload your medical reports to get detailed, easy-to-understand explanations of your test results and health data.</p>
                                            <div className="mt-3 flex items-center gap-1 text-sm font-medium text-[var(--primary-600)]">
                                                <span>Upload report</span>
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link> */}

                        </div>
                        {/* Stats row integrated below main cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
                            <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] p-6 text-center shadow-md transform hover:scale-[1.02] transition-transform">
                                <div className="text-4xl font-extrabold text-[var(--primary-600)] mb-1">50K+</div>
                                <div className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary-500)]">Consultations</div>
                            </div>
                            <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] p-6 text-center shadow-md transform hover:scale-[1.02] transition-transform">
                                <div className="text-4xl font-extrabold text-blue-500 mb-1">95%</div>
                                <div className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary-500)]">Accuracy</div>
                            </div>
                            <div className="rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] p-6 text-center shadow-md transform hover:scale-[1.02] transition-transform">
                                <div className="text-4xl font-extrabold text-[var(--primary-600)] mb-1">24/7</div>
                                <div className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary-500)]">Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
