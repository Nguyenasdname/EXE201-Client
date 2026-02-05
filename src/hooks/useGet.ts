import { useState, useEffect, useCallback } from "react"
import api from '../api'

export const useGet = <T = unknown>(endpoint: string, payload?: object) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get<T>(endpoint, { params: payload })
            setData(res.data)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An Error Occurred'))
        } finally {
            setLoading(false)
        }
    }, [endpoint, JSON.stringify(payload)])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
