'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);
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
                    <p className="text-sm text-yellow-600 mt-2">Private Access Only</p>
                </div>

                <form action={dispatch} className="flex flex-col gap-md">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                            name="email"
                            className="p-2 border rounded"
                            placeholder="vendor@example.com"
                            type="email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            name="password"
                            className="p-2 border rounded"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm mb-4">
                        <label className="flex items-center gap-xs">
                            <input type="checkbox" /> Remember me
                        </label>
                    </div>

                    <LoginButton />

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button aria-disabled={pending} type="submit" variant="primary" style={{ width: '100%' }}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    );
}
