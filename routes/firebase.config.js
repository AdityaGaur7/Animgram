// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCimeg533tmm29UUwjows_VRHmDSlPDw-g",
  authDomain: "imageupload-ded28.firebaseapp.com",
  projectId: "imageupload-ded28",
  storageBucket: "imageupload-ded28.appspot.com",
  messagingSenderId: "956847690305",
  appId: "1:956847690305:web:94f18f6a7db42f86b4acc0",
  measurementId: "G-XW7M7X4DQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAnalytics(app);

module.exports={auth};