import { useCallback } from 'react'
import toast from 'react-hot-toast'

export function useToast() {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
      },
    })
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
      },
    })
  }, [])

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      position: 'bottom-right',
    })
  }, [])

  const dismiss = useCallback((toastId: string) => {
    toast.dismiss(toastId)
  }, [])

  return { success, error, loading, dismiss }
}
