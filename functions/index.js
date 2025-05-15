const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

admin.initializeApp();

exports.onPechayScanUpload = onObjectFinalized(
  {
    bucket: "agrisense-6a089.firebasestorage.app", // tama ang bucket name
    region: "asia-southeast1",
  },
  async (event) => {
    if (!event.name) return;

    const db = getFirestore();
    const snapshot = await db.collection("deviceTokens").get();
    const registrationTokens = snapshot.docs.map(doc => doc.data().token);

    if (registrationTokens.length === 0) {
      console.log("No tokens to send notifications to.");
      return;
    }

    const payload = {
      notification: {
        title: "New Pechay Scan Received",
        body: `File: ${event.name}`,
        sound: "default",
      },
    };

    try {
      const response = await admin.messaging().sendToDevice(registrationTokens, payload);
      console.log("Notifications sent:", response.successCount);
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }
);
