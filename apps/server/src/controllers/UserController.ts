import { Response, Request, Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { DBgetUserData } from "../services/DB/UserService";

export default function UserController() {
  const router = Router();

  router.post("/data", AuthMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await DBgetUserData(res.get("email")!);
      res.status(200).send({ user });
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  });

  return router;
}
