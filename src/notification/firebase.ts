import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend } from "../Api";


// ...existing code...
const sendDeviceTokenToBackend = async (token: string | null) => {
  try {
    if (!token || typeof token !== "string" || token.length < 50) {
      throw new Error('Invalid token format');
    }
    
    await sendTokenToBackend(token);
  } catch (error) {
    console.error('Error sending device token:', error);
  }
};
// const firebaseConfig = {
//     apiKey: "AIzaSyCKt2wYuYzr0uKWe8o5jUE6p9wb-3lSK68",
//     authDomain: "movie-explorer-5bc8a.firebaseapp.com",
//     projectId: "movie-explorer-5bc8a",
//     storageBucket: "movie-explorer-5bc8a.firebasestorage.app",
//     messagingSenderId: "561268525206",
//     appId: "1:561268525206:web:9ba893c094bf72aed81ab7",
//     measurementId: "G-XPP4G1SXPV"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCn_PDsUKRavjNluvdIkGJn40ZUcMoJ2-E",
  authDomain: "movieexplorerplus-a09f0.firebaseapp.com",
  projectId: "movieexplorerplus-a09f0",
  storageBucket: "movieexplorerplus-a09f0.firebasestorage.app",
  messagingSenderId: "482058570774",
  appId: "1:482058570774:web:43d32a12c0c31ebb08f937",
  measurementId: "G-T7N8YDJVC5"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    // Check if permission is already granted
    if (Notification.permission === "granted") {
      // const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
      const vapidKey = "BIr3lBH6e_kZaabd6ckdWCWzpvHjXh_gFWV6MEzr3TjL1CWKVIzd-Pih9pbH5wD5I43b7kQITOxYScXY7ACo0D8"
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
    const vapidKey = "BIr3lBH6e_kZaabd6ckdWCWzpvHjXh_gFWV6MEzr3TjL1CWKVIzd-Pih9pbH5wD5I43b7kQITOxYScXY7ACo0D8";
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

export { onMessage };