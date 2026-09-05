import { forwardRef, useImperativeHandle, useRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', children, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    return (
        <select
            {...props}
            className={
                'rounded-xl border-ink-200 bg-white shadow-sm transition duration-150 focus:border-brand-600 focus:ring-brand-600 ' +
                className
            }
            ref={localRef}
        >
            {children}
        </select>
    );
});
