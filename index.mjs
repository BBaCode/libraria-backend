import express from "express";
import cors from "cors";
import { router as userRouter } from "./routes/users.js";
// import { getAnalytics } from "firebase/analytics";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(4500, () => {
  console.log("App is up and running on port 4500");
});

app.use("/users", userRouter);

// const analytics = getAnalytics(app);
