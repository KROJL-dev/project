import type { ReactNode, FC } from 'react'
import { useEffect, useState } from 'react'

interface IProps {
  label: ReactNode
  timer: number
}
const NotificationTimer: FC<IProps> = ({ label, timer }) => {
  const [timeValue, setTimeValue] = useState<number>(0)

  useEffect(() => {
    setTimeValue(timer + 1)

    const interval = setInterval(() => {
      setTimeValue(value => {
        const newSeconds = value - 1
        if (newSeconds >= timer + 1) {
          clearInterval(interval)
        }
        return newSeconds
      })
    }, 1000)
  }, [timer])

  return (
    <div>
      {label} {timeValue}
    </div>
  )
}
export default NotificationTimer
