import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, User, HeartPulse } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border-light)] bg-[var(--surface-white)]/80 backdrop-blur-md">
            <div className="container h-[var(--header-height)] flex items-center justify-between">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-blue-500 text-white transition-transform group-hover:scale-105">
                        <HeartPulse size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-none text-[var(--secondary-900)]">DocAssist AI</span>
                        <span className="text-xs font-medium text-[var(--secondary-500)]">Virtual Doctor</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        Home
                    </Link>
                    <Link to="/symptoms" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        Symptom Checker
                    </Link>
                    {/* <Link to="/report" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        Analyze Report
                    </Link> */}
                    <Link to="/medications" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        Drug Lookup
                    </Link>
                    <Link to="/features" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        Features
                    </Link>
                    <Link to="/how-it-works" className="text-sm font-medium text-[var(--secondary-600)] hover:text-[var(--primary-600)] transition-colors">
                        How it Works
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link to="/profile">
                            <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-[var(--surface-background)] hover:bg-[var(--secondary-50)] border border-[var(--border-light)] transition-all cursor-pointer group">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)]">
                                    <User size={16} />
                                </div>
                                <span className="text-sm font-medium text-[var(--secondary-700)] group-hover:text-[var(--primary-700)]">
                                    {user?.name?.split(' ')[0] || 'Profile'}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <Link to="/login" className="hidden sm:block">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                    )}

                    <Link to="/symptoms">
                        <Button variant="primary" size="sm" icon={Stethoscope}>
                            Check Symptoms
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};
