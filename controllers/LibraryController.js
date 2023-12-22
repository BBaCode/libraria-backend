import { getDatabase, ref, get, set, child } from "firebase/database";
import { v4 } from "uuid";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVU9fB1VueBzPiF7jFn0-5O3V4BAQ-EL0",
  authDomain: "libraria-732ca.firebaseapp.com",
  projectId: "libraria-732ca",
  storageBucket: "libraria-732ca.appspot.com",
  messagingSenderId: "115290080062",
  appId: "1:115290080062:web:d24a2ccd8faceaa3ca226f",
  measurementId: "G-5ZBYF76BTN",
};

const fbapp = initializeApp(firebaseConfig);

const auth = getAuth(fbapp);
// DATA IS DENORMALIZED, NEED TO TAKE TH LIBRARY AND THEN GRAB ALL THE BOOKS BASED ON IDs
const getLibrary = async (req, res) => {
  try {
    const userId = req.body.userId; // Get user ID from the request body
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `libraries/` + userId)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        res.send(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const writeNewBook = async (req, res) => {
  const bookInfo = req.body.volumeInfo;
  const bookId = req.body.id;
  const userId = req.body.userId;
  const db = getDatabase();
  set(ref(db, "libraries/" + userId + "/" + bookId), {
    volumeInfo: bookInfo,
  });

  if (bookInfo.authors) {
    set(ref(db, "books/" + bookId), {
      volumeInfo: bookInfo,
    });
  } else {
    set(ref(db, "books/" + bookId), {
      volumeInfo: bookInfo,
    });
  }

  res.send(bookInfo);
};

export { getLibrary, writeNewBook };
