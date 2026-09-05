import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2.5 pe-4 ps-3 ${
                active
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-transparent text-ink-600 hover:border-ink-200 hover:bg-ink-50 hover:text-ink-900'
            } text-base font-medium transition duration-200 ease-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
