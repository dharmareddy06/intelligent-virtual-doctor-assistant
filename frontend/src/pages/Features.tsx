import React from 'react';
import {
    ShieldCheck,
    Clock,
    Database,
    Lock,
    Zap,
    Stethoscope,
    Brain,
    HeartPulse,
    Thermometer,
    FileText
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Stethoscope,
        title: "AI Symptom Analysis",
        description: "Describe your symptoms in plain language and our AI analyzes possible conditions, severity levels, and provides personalized recommendations.",
        accent: "from-blue-500 to-blue-600"
    },
    {
        icon: FileText,
        title: "Medical Report Analyzer",
        description: "Upload your medical reports and get detailed, easy-to-understand explanations of your results, translating complex medical jargon into simple terms.",
        accent: "from-[var(--primary-500)] to-[var(--primary-600)]"
    },
    {
        icon: Brain,
        title: "Intelligent Health Insights",
        description: "Get AI-powered insights about your health conditions, including severity assessment, home remedies, and when to seek emergency care.",
        accent: "from-purple-500 to-purple-600"
    },
    {
        icon: ShieldCheck,
        title: "Drug Interaction Warnings",
        description: "Automatically detect potentially dangerous interactions between your medications and get safety alerts before combining drugs.",
        accent: "from-red-500 to-red-600"
    },
    {
        icon: Thermometer,
        title: "Severity Assessment",
        description: "Each analysis includes a color-coded severity indicator so you know whether your symptoms require urgent attention or can be managed at home.",
        accent: "from-yellow-500 to-yellow-600"
    },
    {
        icon: HeartPulse,
        title: "Personalized Recommendations",
        description: "Receive tailored health recommendations, home remedies, lifestyle changes, and guidance on when to visit a healthcare professional.",
        accent: "from-pink-500 to-pink-600"
    },
    {
        icon: Database,
        title: "Consultation History",
        description: "Keep a complete, searchable history of all your past symptom checks and report analyses in one secure location.",
        accent: "from-indigo-500 to-indigo-600"
    },
    {
        icon: Lock,
        title: "Privacy First",
        description: "Your health data stays private. We don't store medical reports after processing, and all analysis is performed securely.",
        accent: "from-gray-600 to-gray-700"
    },
    {
        icon: Clock,
        title: "Instant Results",
        description: "Get comprehensive health analysis in seconds, not hours. Our AI processes symptoms and medical reports in real-time.",
        accent: "from-[var(--primary-500)] to-blue-500"
    }
];

export const Features: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--surface-background)]">
            {/* Hero Section */}
            <section className="pt-20 pb-12 lg:pt-32 lg:pb-20 text-center px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-sm font-medium mb-6">
                        <Zap size={16} fill="currentColor" />
                        <span>Powerful Capabilities</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-[var(--secondary-900)] mb-6 tracking-tight">
                        Everything you need for <br className="hidden md:block" />
                        <span className="text-[var(--primary-600)]">intelligent health guidance</span>
                    </h1>
                    <p className="text-lg text-[var(--secondary-500)] max-w-2xl mx-auto leading-relaxed">
                        From symptom analysis to medical report explanations — we combine cutting-edge AI with intuitive design to make understanding your health simple and accessible.
                    </p>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="pb-24 px-4">
                <div className="container">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-light)] hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-300"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.accent} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--secondary-900)] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--secondary-500)] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Two-Path Section */}
            <section className="py-20 bg-[var(--surface-white)] border-y border-[var(--border-light)]">
                <div className="container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--secondary-900)] mb-4">Two Ways to Get Help</h2>
                        <p className="text-lg text-[var(--secondary-500)] max-w-2xl mx-auto">Whether you have a medical report or just symptoms, we've got you covered.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Symptom Path */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                                <Stethoscope size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--secondary-900)] mb-3">No Prescription?</h3>
                            <p className="text-[var(--secondary-500)] mb-6 leading-relaxed">
                                Simply describe your symptoms in your own words. Our AI will analyze them and provide possible conditions, severity assessment, and recommendations.
                            </p>
                            <Link to="/symptoms">
                                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">Check Your Symptoms</Button>
                            </Link>
                        </div>

                        {/* Report Path */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)]/50 border border-[var(--primary-200)]">
                            <div className="w-14 h-14 bg-[var(--primary-600)] rounded-xl flex items-center justify-center text-white mb-6">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--secondary-900)] mb-3">Have a Medical Report?</h3>
                            <p className="text-[var(--secondary-500)] mb-6 leading-relaxed">
                                Upload a photo or PDF of your medical report. Our AI will analyze the contents and provide a detailed, plain-English explanation of your results.
                            </p>
                            <Link to="/report">
                                <Button size="lg" className="w-full">Analyze Report</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 text-center">
                <div className="container max-w-3xl">
                    <h2 className="text-3xl font-bold text-[var(--secondary-900)] mb-6">
                        Ready to take control of your health?
                    </h2>
                    <p className="text-lg text-[var(--secondary-500)] mb-8">
                        Get instant AI-powered health insights. No appointment needed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/symptoms">
                            <Button size="lg">Check Symptoms Now</Button>
                        </Link>
                        <Link to="/report">
                            <Button variant="secondary" size="lg">Analyze a Report</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
