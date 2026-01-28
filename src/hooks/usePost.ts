import { useState } from "react"
import api from '../api'

export const usePost = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const postData = async <T = unknown>(endpoint: string, payload: object | FormData): Promise<T> => {
        setLoading(true)
        try {
            const isFormData = payload instanceof FormData
            const res = await api.post(endpoint, payload, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
            })
            return res.data as T
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An Error Occurred'))
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { postData, loading, error }
}
