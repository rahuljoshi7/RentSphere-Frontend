import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useApi(apiFn, { onSuccess, successMsg } = {}) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [data,    setData]    = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      const result = res.data
      setData(result)
      if (successMsg) toast.success(successMsg)
      if (onSuccess)  onSuccess(result)
      return result
    } catch (err) {
      const msg = err.userMessage || 'An error occurred'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [apiFn, successMsg, onSuccess])

  return { execute, loading, error, data }
}
