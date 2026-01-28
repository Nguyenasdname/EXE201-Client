import { useState } from "react";
import api from '../api';

export const usePut = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const putData = async <T = unknown>(endpoint: string, payload: object | FormData): Promise<T> => {
        setLoading(true);
        try {
            const isFormData = payload instanceof FormData;
            const res = await api.put(endpoint, payload, {
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

    return { putData, loading, error };
};
