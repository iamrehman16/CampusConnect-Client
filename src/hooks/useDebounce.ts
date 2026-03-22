import { useEffect, useState } from 'react';

/**
 * useDebounce — delays updating a value until a pause in changes.
 * Useful for search inputs to avoid firing on every keystroke.
 */
export const useDebounce = <T>(value: T, delayMs: number = 400): T => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
};
