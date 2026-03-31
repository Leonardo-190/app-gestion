import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function initNotifications() {
  try {
    if (!Device.isDevice) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.warn('initNotifications error', e);
    return false;
  }
}

export async function scheduleNotification({ title, body, date }) {
  try {
    if (!date) return null;
    const trigger = date instanceof Date ? date : new Date(date);
    // solo se programa si la fecha es futura
    if (trigger <= new Date()) return null;
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: title || 'Recordatorio', body: body || '' },
      trigger,
    });
    return id;
  } catch (e) {
    console.warn('scheduleNotification error', e);
    return null;
  }
}

export async function cancelNotification(id) {
  try {
    if (!id) return;
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.warn('cancelNotification error', e);
  }
}

export default {
  initNotifications,
  scheduleNotification,
  cancelNotification,
};
