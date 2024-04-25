import { Request, Response, Router } from "express";
import { DBCreateUser, DBVerifyUser } from "../services/DB/AuthService";
import { SignInRequestType, SignUpRequestType } from "../types/Auth";
import { Prisma } from "@prisma/client";
import { decodeJwtToken, generateJwtToken } from "../services/utils/useToken";
import generateHash from "../services/utils/generateHash";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export default function AuthController(): Router {
  const router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    const { email, name, password } = req.body as SignUpRequestType;

    try {
      if (!email || !name || !password) throw Error("Incomplete Information");

      const passwordHash = generateHash(email, password);
      const user = await DBCreateUser({ email, name, passwordHash });
      const token = generateJwtToken({ email, passwordHash });

      res.set("token", token);
      res.status(200).send({ user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P1001") error.message = "Database Down";
        if (error.code === "P2002") error.message = "Email Already In Use";
      }

      res.status(404).send({ message: error.message });
    }
  });
  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body as SignInRequestType;

    try {
      if (!email || !password) throw Error("Incomplete Information");
      const passwordHash = generateHash(email, password);
      const user = await DBVerifyUser({ email, passwordHash });
      const token = generateJwtToken({ email, passwordHash });
      res.set("token", token);
      res.status(200).send({ user });
    } catch (error) {
      res.status(401).send({
        message: error.message,
      });
    }
  });
  router.get("/verify", AuthMiddleware, async (req: Request, res: Response) => {
    res.status(200).send();
  });

  return router;
}
