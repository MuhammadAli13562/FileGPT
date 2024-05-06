import { Prisma } from "@prisma/client";

export const ContextSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  chatEngineMessages: true,
  ChatWindowMessages: {
    orderBy: {
      createdAt: "asc",
    },
  },
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
    take: 0,
  },
} satisfies Prisma.UserSelect;

export type UserDataType = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;

export const ContextMetaSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  fileName: true,
  fileURL: true,
  fileKey: true,
  ownerId: true,
} satisfies Prisma.Context_WindowSelect;

export type ContextMetaDataType = Prisma.Context_WindowGetPayload<{
  select: typeof ContextMetaSelect;
}>;

export const UserMetaSelect = {
  Id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  email: true,
  contextWindows: {
    select: ContextMetaSelect,
  },
} satisfies Prisma.UserSelect;

export type UserMetaDataType = Prisma.UserGetPayload<{
  select: typeof UserMetaSelect;
}>;
