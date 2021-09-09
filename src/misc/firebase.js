import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyCkrs6N8Q3JKL59Zkn-qp9zm8Z7LniZ5Rs",
    authDomain: "chat-web-app-2bdc3.firebaseapp.com",
    databaseURL: "https://chat-web-app-2bdc3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-web-app-2bdc3",
    storageBucket: "chat-web-app-2bdc3.appspot.com",
    messagingSenderId: "968501083359",
    appId: "1:968501083359:web:c772eba7959a5f0563bd6a"
  };


const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.database();
export const storage = app.storage();


