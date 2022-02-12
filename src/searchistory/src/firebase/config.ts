import {
  FirebaseOptions,
  getApps,
  getApp,
  initializeApp,
  FirebaseApp,
} from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCpHjiCM2uCBBv3fbgjFypF9BkClBIKaBE",
  authDomain: "searchistory.firebaseapp.com",
  projectId: "searchistory",
  storageBucket: "searchistory.appspot.com",
  messagingSenderId: "856415482516",
  appId: "1:856415482516:web:d98aa2f20615d738043a81",
  measurementId: "G-PVKMNSKQC8",
};

const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();


import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const db = getFirestore(firebaseApp);

if (import.meta.env.VITE_ENV === "development") {
  console.log("start development")
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { firebaseApp, db };
