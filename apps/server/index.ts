import express from "express";
import UserController from "./src/controllers/UserController";
import AuthController from "./src/controllers/AuthController";
import cors from "cors";
const app = express();
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.SERVER_PORT;
const CLIENT_URL = process.env.CLIENT_ORIGIN_URL;

const corsOptions = {
  // origin: CLIENT_URL,
  exposedHeaders: ["*"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", AuthController());
app.use("/user", UserController());

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
