import express from "express";
import { router as userRouter } from "./routes/users.js";
// import { getAnalytics } from "firebase/analytics";

const app = express();
app.use(express.json());

app.listen(4500, () => {
  console.log("App is up and running on port 4500");
});

app.use("/users", userRouter);

// Initialize Firebas

// writeUserData("ID2", "caroline", "caroline@gmail.com");
// const analytics = getAnalytics(app);
