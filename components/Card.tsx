import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    action?: React.ReactNode;
}

export function Card({ title, children, className = '', action, ...props }: CardProps) {
    return (
        <div className={`card ${className} `} {...props}>
            {(title || action) && (
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                    {title && <h3 style={{ margin: 0 }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div>{children}</div>
        </div>
    );
}
