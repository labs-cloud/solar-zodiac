import React from 'react';
import { Card } from './Card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down';
    color?: string; // Optional CSS color override for the value
}

export function StatCard({ title, value, icon, trend, trendDirection, color }: StatCardProps) {
    return (
        <Card>
            <div className="flex justify-between items-center mb-2">
                <span className="text-secondary text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {title}
                </span>
                {icon && <span style={{ color: 'var(--color-primary)' }}>{icon}</span>}
            </div>
            <div className="flex items-end gap-sm">
                <span className="text-2xl font-bold" style={{ fontSize: '1.5rem', color: color || 'var(--color-text-main)' }}>
                    {value}
                </span>
                {trend && (
                    <span
                        className="text-sm"
                        style={{
                            color: trendDirection === 'down' ? 'var(--color-error)' : 'var(--color-success)',
                            marginBottom: '4px'
                        }}
                    >
                        {trend}
                    </span>
                )}
            </div>
        </Card>
    );
}
