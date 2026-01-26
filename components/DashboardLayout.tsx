'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                marginLeft: '250px',
                width: 'calc(100% - 250px)',
                backgroundColor: 'var(--color-background)',
                minHeight: '100vh',
                padding: '32px'
            }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
