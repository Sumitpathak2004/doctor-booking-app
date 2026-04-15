import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDk7C1C-AW24nXbu2QtpEcN5YczVQNylOg",
  authDomain: "doctor-booking-app-a224c.firebaseapp.com",
  projectId: "doctor-booking-app-a224c",
  storageBucket: "doctor-booking-app-a224c.appspot.com",
  messagingSenderId: "68720566527",
  appId: "1:68720566527:web:7cc033d8d2da7a820eacca",
};
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);