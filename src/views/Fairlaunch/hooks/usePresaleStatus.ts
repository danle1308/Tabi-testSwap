import { useState, useEffect, SetStateAction, Dispatch } from 'react'

interface PresaleStatus {
  title: string
  status: string
}

interface UsePresaleStatus {
  status: PresaleStatus
  onUpdateStatus: Dispatch<SetStateAction<PresaleStatus>>
  calculateStatus: (currentTime: Date) => PresaleStatus
}

const usePresaleStatus = (startDateTime: Date, endDateTime: Date): UsePresaleStatus => {
  const [status, setStatus] = useState<PresaleStatus>({ title: '', status: '' })

  const calculateStatus = (currentTime: Date): PresaleStatus => {
    let title = ''
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let status = ''

    if (currentTime < startDateTime) {
      title = 'Presale Starts In:'
      status = 'Upcoming'
    } else if (currentTime < endDateTime) {
      title = 'Presale Ends In:'
      status = 'Live'
    } else {
      title = 'Presale has Ended'
      status = 'Ended'
    }

    return {
      title,
      status,
    }
  }

  const onUpdateStatus: Dispatch<SetStateAction<PresaleStatus>> = (newStatus) => {
    setStatus(newStatus)
  }

  useEffect(() => {
    const updateStatus = () => {
      const currentTime = new Date()
      const newStatus = calculateStatus(currentTime)

      if (newStatus.status !== status.status || newStatus.title !== status.title) {
        onUpdateStatus(newStatus)
      }
    }

    const timer = setInterval(updateStatus, 1000)

    return () => {
      clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateTime, endDateTime, status])

  return { status, onUpdateStatus, calculateStatus }
}

export default usePresaleStatus
