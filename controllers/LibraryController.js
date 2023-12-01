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
const getAllLibaries = async (req, res) => {
  try {
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `libraries/` + auth.currentUser.uid)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          res.send(snapshot.val());
        } else {
          console.log("No data available");
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const writeNewBook = async (req, res) => {
  const bookInfo = req.body;
  const user = auth.currentUser;
  const userId = user.uid;
  const db = getDatabase();
  set(ref(db, "libraries/" + userId), {
    id: bookInfo.id,
  });

  if (bookInfo.authors) {
    set(ref(db, "books/" + bookInfo.id), {
      title: bookInfo.title,
      authors: bookInfo.authors,
    });
  } else {
    set(ref(db, "books/" + bookInfo.id), {
      title: bookInfo.title,
      authors: "unknown",
    });
  }

  res.send(bookInfo);
};

export { getAllLibaries, writeNewBook };
