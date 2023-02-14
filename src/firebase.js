// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "rocketgram-16469.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-16469-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rocketgram-16469",
  storageBucket: "rocketgram-16469.appspot.com",
  messagingSenderId: "1036008455560",
  appId: "1:1036008455560:web:d17c4abbc75533b8a24e3d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
