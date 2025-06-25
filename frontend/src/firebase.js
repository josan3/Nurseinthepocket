 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCAjcX2nkIHLWnoRaejWH_BeTPqbNDucXk",
    authDomain: "nurseinthepocket-17c19.firebaseapp.com",
    projectId: "nurseinthepocket-17c19",
    storageBucket: "nurseinthepocket-17c19.firebasestorage.app",
    messagingSenderId: "44944213119",
    appId: "1:44944213119:web:faa8a60b0a50093f536b4a",
    measurementId: "G-EVWDQWVFRG"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  console.log("app", app);
  export const auth = getAuth(app);
  console.log("auth", auth);
  export const analytics = getAnalytics(app);
  console.log("analytics", analytics);
