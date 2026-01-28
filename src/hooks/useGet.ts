import { useState, useEffect } from "react"
import api from '../api'

export const useGet = <T = unknown>(enpoint: string, payload?: object) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get<T>(enpoint)
                setData(res.data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An Error Occurred'))
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [enpoint, JSON.stringify(payload)])
    return { data, loading, error }
}
