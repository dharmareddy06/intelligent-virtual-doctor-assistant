import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Mock login behavior
            if (formData.email && formData.password) {
                login({ name: 'Test User', email: formData.email });
                navigate('/'); // Redirect to Home
            } else {
                setError('Login failed. Please provide email and password.');
            }
        } catch (err) {
            setError('Unable to mock login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-background)] px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[var(--secondary-900)]">Welcome Back</h2>
                    <p className="mt-2 text-[var(--secondary-500)]">
                        Sign in to access your digital medicine cabinet
                    </p>
                </div>

                <div className="bg-[var(--surface-white)] py-8 px-4 shadow-xl rounded-2xl border border-[var(--border-light)] sm:px-10 relative overflow-hidden">
                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[var(--primary-100)] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <form className="space-y-6 relative" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--secondary-700)]">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[var(--secondary-400)]" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm placeholder-[var(--secondary-400)] text-[var(--secondary-900)]"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--secondary-700)]">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[var(--secondary-400)]" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-[var(--border-light)] rounded-lg focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] sm:text-sm placeholder-[var(--secondary-400)] text-[var(--secondary-900)]"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                className="justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--border-light)]" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[var(--surface-white)] text-[var(--secondary-500)]">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="secondary" fullWidth className="justify-center text-sm">
                                Google
                            </Button>
                            <Button variant="secondary" fullWidth className="justify-center text-sm">
                                Apple
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--secondary-500)]">
                            Don't have an account?{' '}
                        </span>
                        <Link to="/register" className="font-medium text-[var(--primary-600)] hover:text-[var(--primary-500)]">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
