import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "./client";
import jwt from "jsonwebtoken";
import path from "path";

async function main() {
  await prisma.user.create({
    data: {
      name: "Muhammad Ali",
      email: "a@a.com",
      passwordHash: "asdada",
    },
  });
}

async function ret() {
  try {
    const decoded = jwt.verify("1234", "456");
  } catch (error: any) {
    console.log("error :", error.message);
  }
}

const relativePath = "../../uploads/";
const new_path = path.resolve(__dirname, relativePath);

console.log(new_path);
