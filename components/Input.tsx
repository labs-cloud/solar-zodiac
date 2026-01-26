import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-sm" style={{ marginBottom: '16px' }}>
            {label && (
                <label className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
                    {label}
                </label>
            )}
            <input
                className={`input ${className}`}
                style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: error ? '1px solid var(--color-error)' : '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%'
                }}
                {...props}
            />
            {error && <span className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</span>}
        </div>
    );
}
