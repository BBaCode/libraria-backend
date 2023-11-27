import express from "express";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

import { router as userRouter } from "./routes/users.js";
// import { getAnalytics } from "firebase/analytics";

const app = express();

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

app.listen(4500, () => {
  console.log("App is up and running on port 4500");
});

app.use("/users", userRouter);

// Initialize Firebas
const fbapp = initializeApp(firebaseConfig);

function readUserData() {
  let returnData;
  get(dbRef, `users`)
    .then((snapshot) => {
      if (snapshot.exists()) {
        returnData = snapshot.toJSON();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(returnData);
}

function writeUserData(userId, name, email) {
  set((dbRef, "users/" + userId), {
    username: name,
    email: email,
  });
}

// writeUserData("ID2", "caroline", "caroline@gmail.com");
// const analytics = getAnalytics(app);
