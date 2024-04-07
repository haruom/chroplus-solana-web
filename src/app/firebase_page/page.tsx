import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebaseアプリの初期化
const admin = require('firebase-admin');
const serviceAccount = require('../../../nextjs-project-75393-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Firestoreの初期化
const db = getFirestore();

export default function Page() {
  return (
    <div>
      <h1>Firebase Page</h1>
    </div>
  )
}