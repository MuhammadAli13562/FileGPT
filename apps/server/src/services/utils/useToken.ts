import { JwtPayloadType } from "../../types/Auth";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export function generateJwtToken({ email, passwordHash }: JwtPayloadType) {
  return jwt.sign({ email, passwordHash }, secret);
}
export function decodeJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayloadType;
    return decoded;
  } catch (error) {
    throw Error("UnAuthorized");
  }
}
