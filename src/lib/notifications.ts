/**
 * Browser Notification API wrapper. Isolated for easy refactoring to Push API later.
 */

export async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  return Notification.requestPermission();
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    ...options,
    icon: "/vite.svg",
  });
}
