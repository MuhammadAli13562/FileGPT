import { Prisma } from "@prisma/client";

export const UserSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  email: true,
  contextWindows: true,
} satisfies Prisma.UserSelect;

export type UserDataType = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;

export const ContextSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  chatMessages: true,
  vectorURL: true,
  fileName: true,
  fileURL: true,
  fileKey: true,
  ownerId: true,
} satisfies Prisma.Context_WindowSelect;

export type ContextDataType = Prisma.Context_WindowGetPayload<{
  select: typeof ContextSelect;
}>;
