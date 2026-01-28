import { useState } from 'react';
import api from '../api';

export const useDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteData = async <T = unknown>(endpoint: string): Promise<T> => {
        setLoading(true);
        try {
            const res = await api.delete(endpoint);
            return res.data as T;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An Error Occurred'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteData, loading, error };
};
