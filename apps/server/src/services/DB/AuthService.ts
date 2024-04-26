import { SignInDB_Type, SignUpDB_Type } from "../../types/Auth";
import prisma from "../../prisma/client";
import { Prisma } from "@prisma/client";

export const DB_createUser = async ({ email, name, passwordHash }: SignUpDB_Type) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return user;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") error.message = "Email Already In Use";
      else if (error.code === "P1001") error.message = "Database Down";
    }

    throw Error(error.message);
  }
};

export const DB_verifyUser = async ({ email, passwordHash }: SignInDB_Type) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        passwordHash,
      },
    });

    if (user === null) throw Error("Incorrect Username or Password");

    return user;
  } catch (error: any) {
    throw Error(error.message);
  }
};
