import * as Notifications from "expo-notifications";

export async function showLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // agad-agad itong ipapadala
  });
}
