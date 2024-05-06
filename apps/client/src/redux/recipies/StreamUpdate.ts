import { UserApi } from "../api/user";
import { v4 } from "uuid";
import uuidToNumber from "src/lib/uuid2num";
import { ContextDataType } from "@backend/prisma/selections";

export const sendMessage = ({ id, message }: { id: string; message: string }) => {
  console.log("sent message called");

  return UserApi.util.updateQueryData("fetchData", undefined, (draft) => {
    const ctxwin: ContextDataType | undefined = draft.contextWindows.find(
      (ctx: ContextDataType) => ctx.fileKey === id
    );

    if (!ctxwin) return;

    const new_msg = {
      content: message,
      ContextWindowId: ctxwin?.Id,
      createdAt: new Date(),
      updatedAt: new Date(),
      Id: uuidToNumber(v4()),
      role: "user",
    };

    ctxwin.ChatWindowMessages.push(new_msg);
  });
};

export const AddMessage = ({ id, message }: { id: string; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", undefined, (draft) => {
    const ctxwin: ContextDataType | undefined = draft.contextWindows.find(
      (ctx: ContextDataType) => ctx.fileKey === id
    );
    if (ctxwin) {
      const last_msg = ctxwin.ChatWindowMessages[ctxwin.ChatWindowMessages.length - 1];

      if (last_msg.role === "assistant") {
        last_msg.content += message;
      } else {
        const new_msg = {
          content: message,
          ContextWindowId: ctxwin.Id,
          createdAt: new Date(),
          updatedAt: new Date(),
          Id: uuidToNumber(v4()),
          role: "assistant",
        };
        ctxwin.ChatWindowMessages.push(new_msg);
      }
    }
  });
};
