export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex cursor-pointer items-center justify-center rounded-xl border border-transparent bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 ease-out hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 active:scale-[0.98] ${
                    disabled && 'cursor-not-allowed opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
