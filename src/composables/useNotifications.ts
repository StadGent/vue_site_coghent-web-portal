import { ref, watch } from 'vue'

export type NotificationType = 'info' | 'warn' | 'error'

export type Notification = {
  id?: string
  type: NotificationType
  subject: string
  message: string
  timestamp?: number
}

export const notificationsQue = ref<Array<Notification>>([])

watch(notificationsQue, () => {
  if (notificationsQue.value.length >= 1) {
    notificationsQue.value.at(-1)! ? notification.startCountdown(notificationsQue.value.at(-1)!) : null
  }
})

const useNotifications = () => {
  const DEFAULT_NOTIFICATION_TIME_MS = 4000

  const notifications = ref<Array<Notification>>(notificationsQue.value)

  const add = (_notification: Notification) => {
    _notification.timestamp = new Date().getTime()
    _notification.id = `${_notification.timestamp}${_notification.message}`

    notifications.value.push(_notification)
    startCountdown(_notification)
  }

  const startCountdown = async (_notification: Notification) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = notifications.value.indexOf(_notification)
        index !== -1 ? notifications.value.splice(index, 1) : null
        notificationsQue.value = notifications.value
        resolve
      }, DEFAULT_NOTIFICATION_TIME_MS)
    })
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    clearAll,
    add,
    notifications,
    startCountdown,
  }
}

export const notification = useNotifications()

// Upload errors
export const upload_max_size_exceeded = (_allowedSize: number, _size: number) => {
  notification.add({
    type: 'error',
    subject: `File size`,
    message: `The file size ${(_size / 1000000).toFixed(2)}MB is to big. We accept files up to ${_allowedSize / 1000000}MB.`,
  } as Notification)
}

export const upload_unsupported_file_extension = (_allowed_extensions: string) => {
  notification.add({
    type: 'error',
    subject: `File extension`,
    message: `You can only upload files with extension ${_allowed_extensions}`,
  } as Notification)
}

export const upload_duplicate_detected = () => {
  notification.add({
    type: 'error',
    subject: `Duplicate file`,
    message: `This file has been detected as duplicate`,
  } as Notification)
}
