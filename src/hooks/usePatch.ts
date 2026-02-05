import { useState } from 'react';
import api from '../api';

export const usePatch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const patchData = async <T = unknown>(endpoint: string, payload?: object | FormData): Promise<T> => {
        setLoading(true);
        try {
            const isFormData = payload instanceof FormData;
            const res = await api.patch(endpoint, payload, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
            });
            return res.data as T;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An Error Occurred'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { patchData, loading, error };
};
