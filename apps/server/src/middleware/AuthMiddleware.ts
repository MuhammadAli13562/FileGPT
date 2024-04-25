import { Request, Response, NextFunction } from "express";
import { DBverifyUser } from "../services/DB/AuthService";
import { decodeJwtToken } from "../services/utils/useToken";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.headers as { token: string };
    if (!token) throw new Error("Token is missing");

    const { email, passwordHash } = decodeJwtToken(token);
    await DBverifyUser({ email, passwordHash });
    res.set("email", email);
    next();
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};
