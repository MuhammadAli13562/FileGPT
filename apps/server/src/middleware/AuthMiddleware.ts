import { Request, Response, NextFunction } from "express";
import { DB_verifyUser } from "../services/DB/AuthService";
import { decodeJwtToken } from "../services/utils/useJwtToken";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.headers as { token: string };
    if (!token) throw new Error("Token is missing");

    const { email, passwordHash } = decodeJwtToken(token);
    await DB_verifyUser({ email, passwordHash });
    res.set("email", email);
    next();
  } catch (error: any) {
    console.log("authmid : ", error.message);

    res.status(401).send({ message: error.message });
  }
};
