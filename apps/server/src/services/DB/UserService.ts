import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";
import { ContextWindowType, StoreChatDataInputType } from "../../types/User";

export const DB_getUserData = async (email: string) => {
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
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") error.message = "Database Down";
    }
    throw Error(error.message);
  }
};

export const DB_createContextWindow = async (ContextWindowInput: ContextWindowType) => {
  const { email, ...ContextData } = ContextWindowInput;

  try {
    const ContextWindow = await prisma.context_Window.create({
      data: {
        ...ContextData,
        chatMessages: "[]",
        owner: {
          connect: {
            email,
          },
        },
      },
    });
    return ContextWindow;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") error.message = "Database Down";
    }
    throw Error(error.message);
  }
};

export const DB_getContextData = async (Id: number) => {
  try {
    const contextData = await prisma.context_Window.findUnique({
      where: {
        Id,
      },
      select: {
        chatMessages: true,
        vectorURL: true,
      },
    });

    if (!contextData) throw Error("No Context Exists");
    return contextData;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") error.message = "Database Down";
    }
    throw Error(error.message);
  }
};

export const DB_storeChatData = async (StoreChatDataInput: StoreChatDataInputType) => {
  const { Id, chatMessages } = StoreChatDataInput;

  try {
    await prisma.context_Window.update({
      where: {
        Id,
      },
      data: {
        chatMessages,
      },
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P1001") error.message = "Database Down";
    }
    throw Error(error.message);
  }
};
