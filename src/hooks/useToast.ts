import { useCallback } from 'react'
import { toast } from 'sonner'

export function useToast() {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
    })
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 3000,
      position: 'bottom-right',
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
