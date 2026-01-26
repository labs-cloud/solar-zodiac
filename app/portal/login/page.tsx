'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';

export default function VendorLoginPage() {
    const router = useRouter();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-background)'
        }}>
            <Card className="w-full max-w-md p-8" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-primary mb-2">The Snackatere</h1>
                    <p className="text-muted">Vendor Compliance Portal</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.push('/portal/dashboard'); }} className="flex flex-col gap-md">
                    <Input label="Email Address" placeholder="vendor@example.com" type="email" />
                    <Input label="Password" type="password" placeholder="••••••••" />

                    <div className="flex justify-between items-center text-sm mb-4">
                        <label className="flex items-center gap-xs">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="text-primary hover:underline">Forgot password?</a>
                    </div>

                    <Button type="submit" variant="primary" style={{ width: '100%' }}>Login</Button>
                </form>
            </Card>
        </div>
    );
}
