/**
 * NotificationAgent
 * Responsibility: Handling communication with the user (email, SMS, in-app).
 */
export const NotificationAgent = {
  name: "Notification Agent",

  sendUpdate: async (userId, type, content) => {
    console.log(`[NotificationAgent] Sending ${type} update to ${userId}...`);

    // Simulate API call for email/SMS
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      messageId: `NOTIF-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  }
};
