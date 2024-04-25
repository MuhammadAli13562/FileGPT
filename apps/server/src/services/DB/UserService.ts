import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

export const DBgetUserData = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        contextWindows: true,
      },
    });

    if (user === null) throw Error("No User Found");
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") error.message = "Database Down";
    }
    throw Error(error.message);
  }
};

export const DBstoreChatData = () => {};

export const DBcreateContextWindow = () => {};
