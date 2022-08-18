import { ref, watch } from 'vue'

export type NotificationType = 'info' | 'warn' | 'error'

export type Notification = {
  id?: string
  type: NotificationType
  subject: string
  message: string
  timestamp?: number
}

export const notificationsQue = ref<Array<Notification>>([

])

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