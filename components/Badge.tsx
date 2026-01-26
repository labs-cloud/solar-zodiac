import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    className?: string;
}

export function Badge({ label, variant = 'neutral', className = '' }: BadgeProps) {
    return (
        <span className={`badge badge-${variant} ${className}`}>
            {label}
        </span>
    );
}
