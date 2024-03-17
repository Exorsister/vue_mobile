
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBLDez3MsdYRnoZGXr1kvBefYfV5MGzsFM",
  authDomain: "projectmobile-797e9.firebaseapp.com",
  projectId: "projectmobile-797e9",
  storageBucket: "projectmobile-797e9.appspot.com",
  messagingSenderId: "512174301237",
  appId: "1:512174301237:web:1a624082ce2f8345cfd17c",
  measurementId: "G-51WW5SW7BN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default {app, analytics}