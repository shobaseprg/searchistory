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
const isEmulating = window.location.hostname === "localhost";
if (isEmulating) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}


export { firebaseApp, db };


// import { collection, connectFirestoreEmulator, getDocs, getFirestore } from 'firebase/firestore';
// import { initializeFirebase } from './firebase';

// initializeFirebase()

// export const fetchRamen = () => {

//   const firestore = getFirestore();
//   connectFirestoreEmulator(firestore, 'localhost', 8080);

//   const coll = collection(firestore, 'ramens')
//   getDocs(coll).then(snapshot => {
//     snapshot.docs.map(doc => {
//       console.log(doc.data())
//     })
//   })
// }
