import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDguN_VQOuGRz2RiE1ookzEmrs6e68TGL8",
  authDomain: "haven-dad72.firebaseapp.com",
  projectId: "haven-dad72",
  storageBucket: "haven-dad72.appspot.com",
  messagingSenderId: "265659634358",
  appId: "1:265659634358:web:25938fb1528b527f4ccc17",
  measurementId: "G-EPE80PYJQD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
