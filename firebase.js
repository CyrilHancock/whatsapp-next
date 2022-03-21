// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGj7H5ih3tBrgBCsvGEnauba_yupVY-zA",
  authDomain: "whatsapp-2-next-88088.firebaseapp.com",
  projectId: "whatsapp-2-next-88088",
  storageBucket: "whatsapp-2-next-88088.appspot.com",
  messagingSenderId: "501027206813",
  appId: "1:501027206813:web:c8d4225c7320b820c04674"
};

// Initialize Firebase
const app =!getApps().length? initializeApp(firebaseConfig):getApp();
const db=getFirestore()
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
export {app,db,provider,auth}





