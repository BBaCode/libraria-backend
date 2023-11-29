import { getDatabase, ref, get, set } from "firebase/database";

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
    const snapshot = await get(dbRef, "users");

    if (snapshot.exists()) {
      const data = snapshot.val();
      res.json({ data });
    } else {
      console.log("No data available");
      res.json({ data: null }); // or handle the case when no data is available
    }
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
    await updateProfile(user, {
      displayName: userInformation.displayName,
    })
      .then(() => {
        console.log("Name added: " + userInformation.displayName);
      })
      .catch((error) => {
        console.log(error);
      });
    const detailsSent = {
      displayName: user.displayName,
      email: user.email,
    };
    res.json(detailsSent);
    console.log(user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.status(errorCode).send(errorMessage);
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
        id: user.uid,
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
