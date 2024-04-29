import { Prisma } from "@prisma/client";

export const ContextSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  chatEngineMessages: true,
  ChatWindowMessages: true,
  vectorURL: true,
  fileName: true,
  fileURL: true,
  fileKey: true,
  ownerId: true,
} satisfies Prisma.Context_WindowSelect;

export type ContextDataType = Prisma.Context_WindowGetPayload<{
  select: typeof ContextSelect;
}>;

export const UserSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  email: true,
  contextWindows: {
    select: ContextSelect,
  },
} satisfies Prisma.UserSelect;

export type UserDataType = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;
