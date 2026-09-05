import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen overflow-hidden bg-ink-50 text-ink-900">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.14),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(15,23,42,0.06),_transparent_45%)]" />
                <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
                    <header className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ApplicationLogo className="h-10 w-10" />
                            <span className="font-display text-lg font-semibold tracking-tight">Retail POS</span>
                        </div>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-white hover:text-ink-900"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="flex flex-1 flex-col items-start justify-center py-16">
                        <p className="mb-4 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                            Point of Sale
                        </p>
                        <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
                            Faster checkout. Cleaner inventory. Better retail days.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                            Manage products, categories, and orders from one workspace built for the counter.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('pos.index')}
                                    className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                                >
                                    Open POS
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                                >
                                    Start selling
                                </Link>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
