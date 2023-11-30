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

const getAllUsers = async (req, res) => {
  try {
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `users/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          res.send(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const writeNewUser = async (req, res) => {
  try {
    let userInformation = req.body;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userInformation.email,
      userInformation.password
    );

    // User successfully created
    const user = userCredential.user;

    // Update user with a displayname
    await updateProfile(user, {
      displayName: userInformation.displayName,
    })
      .then(() => {
        console.log("Name added: " + userInformation.displayName);
      })
      .catch((error) => {
        console.log(error);
      });

    // create library for user
    const userId = user.uid;
    const db = getDatabase();
    set(ref(db, "libraries/" + userId), {
      books: { 1: "example" },
    });
    // create user in a userdb
    set(ref(db, "users/" + userId), {
      displayName: user.displayName,
      email: user.email,
    });

    //details to be sent to the client
    const detailsSent = {
      displayName: user.displayName,
      email: user.email,
    };
    res.json(detailsSent);
    console.log(user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(500).send(errorMessage);
  }
};

const loginUser = async (req, res) => {
  let userInformation = req.body;
  signInWithEmailAndPassword(
    auth,
    userInformation.email,
    userInformation.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const detailsSent = {
        displayName: user.displayName,
        email: user.email,
      };
      res.status(200).json(detailsSent);
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.send(errorMessage);
    });
};

const logoutUser = async (req, res) => {
  signOut(auth)
    .then(() => {
      res.send("user signed out");
    })
    .catch((error) => {
      res.send(error);
    });
};

export { getAllUsers, writeNewUser, loginUser, logoutUser };
