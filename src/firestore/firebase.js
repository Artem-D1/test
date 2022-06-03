import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNAQUuuphPhlyb-M9hGOXnxcQZWZXlnpU",
  authDomain: "library-243e6.firebaseapp.com",
  projectId: "library-243e6",
  storageBucket: "library-243e6.appspot.com",
  messagingSenderId: "817931550427",
  appId: "1:817931550427:web:eb606bb440e3426a1f16fe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
