import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDIdF49N2aWHb7YngpvhK4HSj1JIwBzcAo",
  authDomain: "talkiechat-b0285.firebaseapp.com",
  projectId: "talkiechat-b0285",
  storageBucket: "talkiechat-b0285.appspot.com",
  messagingSenderId: "932085184568",
  appId: "1:932085184568:web:0d0c46f1a1ea8ece4ececd"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);