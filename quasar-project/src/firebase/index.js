// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwm0Rd6-v712EXxLKKxlXlupbOTFgrdng",
  authDomain: "formapp-60bff.firebaseapp.com",
  projectId: "formapp-60bff",
  storageBucket: "formapp-60bff.appspot.com",
  messagingSenderId: "488085268383",
  appId: "1:488085268383:web:c568b8f4cb193dbba63faa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {
  auth,
}
