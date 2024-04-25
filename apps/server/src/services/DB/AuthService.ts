import { SignInDBType, SignUpDBType } from "../../types/Auth";
import prisma from "../../prisma/client";

export const DBcreateUser = async ({ email, name, passwordHash }: SignUpDBType) => {
  try {
    const prev = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (prev !== null) throw Error("Email Already Exists");

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return user;
  } catch (error) {
    throw Error(error.message);
  }
};

export const DBverifyUser = async ({ email, passwordHash }: SignInDBType) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        passwordHash,
      },
    });

    if (user === null) throw Error("Incorrect Username or Password");

    return user;
  } catch (error) {
    throw Error(error.message);
  }
};
