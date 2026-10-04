// Local reminder notifications.
// Everything is guarded: on platforms/runtimes where notifications are not
// available (e.g. Expo Go on Android with SDK 53+), calls degrade to no-ops
// and the in-app reminder still works.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

/**
 * Schedule a local notification for a reminder.
 * `whenISO` = "YYYY-MM-DD" plus optional "HH:mm". Defaults to 9:00 AM.
 * Returns the notification id, or null when scheduling is unavailable.
 */
export async function scheduleReminderNotification(
  reminderId: string,
  title: string,
  body: string,
  whenISO: string,
  time?: string,
): Promise<string | null> {
  try {
    const [y, m, d] = whenISO.split('-').map(Number);
    const [hh, mm] = (time || '09:00').split(':').map(Number);
    const when = new Date(y, (m || 1) - 1, d || 1, hh || 9, mm || 0);
    if (when.getTime() <= Date.now()) return null; // in the past — skip

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#16A34A',
      });
    }

    return await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { reminderId } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    });
  } catch {
    return null;
  }
}

export async function cancelReminderNotification(notificationId?: string | null): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // ignore
  }
}
