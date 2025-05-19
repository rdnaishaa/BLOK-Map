import { useState, useEffect } from 'react'
import api from '../services/api'

export const useApi = (apiFunc, params = {}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await apiFunc(params)
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiFunc, params])

  return { data, error, loading }
}