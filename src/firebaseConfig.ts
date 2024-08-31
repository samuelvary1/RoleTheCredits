import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCirLDPYPky5PevT6_rpV5xWr2fMxK8t4I",
  authDomain: "role-the-credits-83fcf.firebaseapp.com",
  projectId: "role-the-credits-83fcf",
  storageBucket: "role-the-credits-83fcf.appspot.com",
  messagingSenderId: "559018777694",
  appId: "1:559018777694:web:a6883accf40f78618c28cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
