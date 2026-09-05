import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-50 px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_55%)]" />
            <div className="relative flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center gap-3">
                    <ApplicationLogo className="h-14 w-14" />
                    <span className="font-display text-lg font-semibold tracking-tight text-ink-900">
                        Retail POS
                    </span>
                </Link>

                <div className="mt-8 w-full overflow-hidden rounded-2xl border border-ink-200/80 bg-white px-6 py-8 shadow-card sm:max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
