import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold leading-5 transition duration-200 ease-out focus:outline-none ' +
                (active
                    ? 'border-brand-600 text-ink-900'
                    : 'border-transparent text-ink-500 hover:border-ink-200 hover:text-ink-800') +
                className
            }
        >
            {children}
        </Link>
    );
}
