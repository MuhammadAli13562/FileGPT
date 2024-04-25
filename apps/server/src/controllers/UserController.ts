import { Response, Request, Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export default function UserController() {
  const router = Router();

  router.post("/data", AuthMiddleware, async (req: Request, res: Response) => {});

  return router;
}
