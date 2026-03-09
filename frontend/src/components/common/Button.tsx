import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    fullWidth = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "btn-primary", // using our CSS utility class
        secondary: "btn-secondary",
        ghost: "btn-ghost",
    };

    const sizes = {
        sm: "text-sm px-3 py-1.5 gap-1.5",
        md: "text-base px-5 py-2.5 gap-2",
        lg: "text-lg px-6 py-3 gap-2.5",
    };

    return (
        <button
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
            {children}
        </button>
    );
};
