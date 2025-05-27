import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { sendTokenToBackend } from "../services/Api";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn_PDsUKRavjNluvdIkGJn40ZUcMoJ2-E",
  authDomain: "movieexplorerplus-a09f0.firebaseapp.com",
  projectId: "movieexplorerplus-a09f0",
  storageBucket: "movieexplorerplus-a09f0.firebasestorage.app",
  messagingSenderId: "482058570774",
  appId: "1:482058570774:web:43d32a12c0c31ebb08f937",
  measurementId: "G-T7N8YDJVC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Utility to validate URLs
const isValidUrl = (url) => {
  return /^https:\/\/movieexplorerplus-a09f0\.firebaseapp\.com\/movies\/\d+(?:\?.*)?$/.test(url);
};

// Handle foreground push notifications
onMessage(messaging, (payload) => {
  try {
    const notification = payload?.notification || {};
    const data = payload?.data || {};
    const { title = "No Title", body = "No Body" } = notification;
    const { url, notification_type } = data;

    if (notification_type === "movie" && url && isValidUrl(url)) {
      const handleClick = () => {
        window.location.href = url;
      };
      toast.info(`${title}: ${body}`, { onClick: handleClick });
    } else {
      toast.info(`${title}: ${body}`);
    }
  } catch (error) {
    console.error("Error handling FCM message:", error);
    toast.error("Failed to process notification");
  }
});

// Handle WhatsApp messages (placeholder for WhatsApp integration)
export const handleWhatsAppMessage = (message) => {
  try {
    const { body = "" } = message;
    const urlMatch = body.match(/(https:\/\/movieexplorerplus-a09f0\.firebaseapp\.com\/movies\/\d+(?:\?.*)?)/);
    if (urlMatch && isValidUrl(urlMatch[0])) {
      const handleClick = () => {
        window.location.href = urlMatch[0];
      };
      toast.info(body, { onClick: handleClick });
    } else {
      toast.info(body);
    }
  } catch (error) {
    console.error("Error handling WhatsApp message:", error);
    toast.error("Failed to process message");
  }
};

// Generate and send FCM token
export const generateToken = async () => {
  try {
    const vapidKey = "BIr3lBH6e_kZaabd6ckdWCWzpvHjXh_gFWV6MEzr3TjL1CWKVIzd-Pih9pbH5wD5I43b7kQITOxYScXY7ACo0D8";

    // Check if permission is already granted
    if (Notification.permission === "granted") {
      const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
        if (error.code === "messaging/token-unsubscribed" || error.code === "messaging/invalid-token") {
          console.log("Existing token invalid or unsubscribed, generating new token");
          await deleteToken(messaging).catch(() => console.log("No token to delete"));
          return await getToken(messaging, { vapidKey });
        }
        throw error;
      });

      if (token && typeof token === "string" && token.length >= 50) {
        console.log("Existing FCM Token:", token);
        await sendTokenToBackend(token);
        return token;
      }
    }

    // Request permission if not granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return null;
      }
    }

    // Generate new token
    const token = await getToken(messaging, { vapidKey });
    console.log("New FCM Token:", token);

    if (!token || typeof token !== "string" || token.length < 50) {
      console.warn("Generated token appears invalid");
      return null;
    }

    await sendTokenToBackend(token);
    console.log("Token sent to backend:", token);
    return token;
  } catch (error) {
    console.error("Error generating FCM token or sending to backend:", error);
    return null;
  }
};

// Monitor FCM token
export const monitorToken = async () => {
  try {
    const vapidKey = "BIr3lBH6e_kZaabd6ckdWCWzpvHjXh_gFWV6MEzr3TjL1CWKVIzd-Pih9pbH5wD5I43b7kQITOxYScXY7ACo0D8";
    const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
      if (error.code === "messaging/token-unsubscribed" || error.code === "messaging/invalid-token") {
        console.log("Token invalid or unsubscribed, generating new token");
        const newToken = await generateToken();
        return newToken;
      }
      throw error;
    });

    if (!token || typeof token !== "string" || token.length < 50) {
      console.warn("Monitored token appears invalid");
      return null;
    }

    console.log("Token validated:", token);
    await sendTokenToBackend(token);
    return token;
  } catch (error) {
    console.error("Error monitoring FCM token:", error);
    return null;
  }
};

// Export for external use
export { onMessage };