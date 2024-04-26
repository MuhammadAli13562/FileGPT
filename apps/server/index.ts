import express from "express";
import UserController from "./src/controllers/UserController";
import AuthController from "./src/controllers/AuthController";
import cors from "cors";
const app = express();

app.use(cors({ exposedHeaders: ["*"] }));

app.use("/auth", AuthController());
app.use("/user", UserController());

app.listen(3000, () => {
  console.log("Server running on 3000");
});
