// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0ccOGMM2nqsaONnkNiygDMiitrbEshjM",
  authDomain: "react-notes-cde7a.firebaseapp.com",
  projectId: "react-notes-cde7a",
  storageBucket: "react-notes-cde7a.appspot.com",
  messagingSenderId: "1062833748795",
  appId: "1:1062833748795:web:0d20e131af3473bc96551e",
  measurementId: "G-VH6N7FBY3J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const dataBase = getFirestore(app);
export const notesCollection = collection(dataBase, "notes");
