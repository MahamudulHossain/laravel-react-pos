import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { className = '', children, isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'rounded-xl border-ink-200 bg-white shadow-sm transition duration-150 focus:border-brand-600 focus:ring-brand-600 ' +
                className
            }
            ref={localRef}
        >
            {children}
        </textarea>
    );
});
