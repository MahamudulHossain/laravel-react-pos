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
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-100 focus:ring-indigo-100 ' +
                className
            }
            ref={localRef}
        >
            {children}
        </textarea>
    );
});
