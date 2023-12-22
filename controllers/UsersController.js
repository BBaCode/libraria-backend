import {
  getDatabase,
  ref,
  get,
  set,
  child,
  orderByChild,
  query,
  onValue,
  equalTo,
  orderByValue,
} from "firebase/database";
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

const writeNewGoogleUser = async (req, res) => {
  try {
    const user = req.body;
    const userId = user.id;
    const db = getDatabase();
    const familyID = v4();
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

const writeNewUser = async (req, res) => {
  try {
    const user = req.body;
    const userId = user.id;
    const db = getDatabase();
    const familyID = v4();
    // create user in a userdb
    set(ref(db, "users/" + userId), {
      displayName: user.displayName,
      email: user.email,
      familyID,
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

const writeNewParentUser = async (req, res) => {
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

    const userId = user.uid;
    const db = getDatabase();
    const familyID = v4();
    // create user in a userdb
    set(ref(db, "users/" + userId), {
      displayName: user.displayName,
      email: user.email,
      familyID,
    });

    set(ref(db, `families/${familyID}`), {
      familyName: userInformation.familyAccount,
    });

    set(ref(db, `families/${familyID}/members/${user.uid}`), true);

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

const writeNewChildUser = async (req, res) => {
  try {
    const db = getDatabase();
    const userInformation = req.body;
    const parentEmail = userInformation.parentEmail;
    const kidGenEmail = userInformation.username + "@libraria.com";

    // Step 1: Find parent's user ID using the provided parent's email
    const parentRef = ref(db, "users");
    let famID = "";
    await onValue(parentRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().email === parentEmail) {
          famID = childSnapshot.val().familyID;
        }
      });
    });

    if (famID.length > 1) {
      const childCredential = await createUserWithEmailAndPassword(
        auth,
        kidGenEmail,
        userInformation.password
      );
      const childUser = await childCredential.user;

      // Update child user's display name
      await updateProfile(childUser, {
        displayName: userInformation.displayName,
      });

      // Add the child to user database

      await set(ref(db, "users/" + childUser.uid), {
        displayName: userInformation.displayName,
        email: kidGenEmail,
        familyID: famID,
      })
        .then(() => {
          console.log("Child user created successfully");
        })
        .catch(() => {
          console.log("Error creating the user");
        });

      //  Add the child to the family
      await set(
        ref(db, "families/" + famID + "/members/" + childUser.uid),
        true
      )
        .then(() => {
          console.log(`User added to family successfully`);
        })
        .catch(() => {
          console.log("Error adding user to family");
        });

      console.log("Child signup successful");

      // Respond with success or other details
      res.status(200).json({
        displayName: childUser.displayName,
        // send email as username for kids
        email: userInformation.username,
      });
    } else {
      res.status(404).json({
        message: "Hmm, we can't seem to find that email in our system.",
      });
    }
  } catch (error) {
    const errorMessage = error.message;
    // const errorCode = error.code;
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
      res.send(
        "We cannot find the account with those credentials. Please try again."
      );
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

export {
  getAllUsers,
  writeNewUser,
  writeNewGoogleUser,
  writeNewParentUser,
  writeNewChildUser,
  loginUser,
  logoutUser,
};
