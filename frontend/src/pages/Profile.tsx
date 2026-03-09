import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Protect the route
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[var(--surface-background)] pt-20 pb-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <div className="bg-[var(--surface-white)] rounded-2xl shadow-xl border border-[var(--border-light)] overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-[var(--primary-600)] to-[var(--secondary-600)] relative">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)]">
                                    <User size={40} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--secondary-900)]">{user.name}</h1>
                                <p className="text-[var(--secondary-500)]">Member since {new Date().getFullYear()}</p>
                            </div>
                            <Button variant="secondary" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                                <LogOut size={16} className="mr-2" />
                                Sign Out
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            <div className="p-4 rounded-xl bg-[var(--surface-background)] border border-[var(--border-light)] flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--secondary-100)] flex items-center justify-center text-[var(--secondary-600)]">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--secondary-500)]">Email Address</p>
                                    <p className="text-[var(--secondary-900)] font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--surface-background)] border border-[var(--border-light)] flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary-600)]">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--secondary-500)]">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <p className="text-[var(--secondary-900)] font-medium">Active & Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
