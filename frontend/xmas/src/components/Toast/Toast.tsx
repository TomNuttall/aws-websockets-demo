import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface ToastProps {
  msgs: string[]
}

const Toast: React.FC<ToastProps> = ({ msgs }) => {
  useEffect(() => {
    msgs.forEach((msg: string) => {
      toast.success(msg)
    })
  }, [msgs])

  return <Toaster reverseOrder={false} />
}

export default Toast
