import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-sm" style={{ marginBottom: '16px' }}>
            {label && (
                <label className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>
                    {label}
                </label>
            )}
            <select
                className={`select ${className}`}
                style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: error ? '1px solid var(--color-error)' : '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                {...props}
            >
                <option value="" disabled>Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</span>}
        </div>
    );
}
