import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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
    message: `De bestandsgrote ${(_size / 1000000).toFixed(2)}MB is te groot. We accepteren bestanden tot ${_allowedSize / 1000000}MB.`,
  } as Notification)
}

export const upload_unsupported_file_extension = (_allowed_extensions: string) => {
  notification.add({
    type: 'error',
    subject: `File extension`,
    message: `Enkel bestanden met de volgende extenties kunnen worden geupload: ${_allowed_extensions}`,
  } as Notification)
}

export const upload_duplicate_detected = () => {
  notification.add({
    type: 'error',
    subject: `Duplicate file`,
    message: `Dit bestand werd als dubbel gedetecteerd`,
  } as Notification)
}
