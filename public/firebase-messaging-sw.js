importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

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
 
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 