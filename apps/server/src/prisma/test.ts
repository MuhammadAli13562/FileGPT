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

async function fetch() {
  const users = await prisma.user.findMany();

  console.log("users : ", users);
}

fetch();
