import React from 'react';
import { Github, Twitter, Linkedin, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[var(--border-light)] bg-[var(--surface-white)] pt-12 pb-8">
            <div className="container">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-blue-500 rounded-lg flex items-center justify-center text-white">
                                <HeartPulse size={18} />
                            </div>
                            <span className="text-lg font-bold text-[var(--secondary-900)]">DocAssist AI</span>
                        </div>
                        <p className="text-sm text-[var(--secondary-500)]">
                            AI-powered virtual doctor assistance for symptom analysis, medical report scanning, and health guidance.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--secondary-900)] mb-3">Features</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/symptoms" className="text-sm text-[var(--secondary-500)] hover:text-[var(--primary-600)] transition-colors">Symptom Checker</Link>
                            {/* <Link to="/report" className="text-sm text-[var(--secondary-500)] hover:text-[var(--primary-600)] transition-colors">Medical Report Analyzer</Link> */}
                            <Link to="/features" className="text-sm text-[var(--secondary-500)] hover:text-[var(--primary-600)] transition-colors">All Features</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-[var(--secondary-900)] mb-3">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-[var(--secondary-400)] hover:text-[var(--primary-600)] transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-[var(--secondary-400)] hover:text-[var(--primary-600)] transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-[var(--secondary-400)] hover:text-[var(--primary-600)] transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-light)] text-center text-sm text-[var(--secondary-400)]">
                    © {new Date().getFullYear()} DocAssist AI. All rights reserved. Not a substitute for professional medical advice.
                </div>
            </div>
        </footer>
    );
};
