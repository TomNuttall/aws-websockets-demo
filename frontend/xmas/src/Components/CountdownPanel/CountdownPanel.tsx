import { useState, useEffect } from 'react'
import PanelText from '../PanelText'

interface CountdownPanelProps {
  duration: number
  finishMsg: string
  onFinish?: () => void
}

const CountdownPanel: React.FC<CountdownPanelProps> = ({
  duration,
  finishMsg,
  onFinish,
}) => {
  const [count, setCount] = useState<number>(duration)

  useEffect(() => {
    if (count < 0) return

    setTimeout(() => {
      setCount(count - 1)
    }, 1000)
  }, [count])

  let msg = ''
  if (count > 0) {
    msg = count.toString()
  } else if (count === 0) {
    msg = finishMsg
    if (onFinish) {
      onFinish()
    }
  }
  return <PanelText msg={msg} showOnFinish={count >= 0} scale={2} />
}

export default CountdownPanel
