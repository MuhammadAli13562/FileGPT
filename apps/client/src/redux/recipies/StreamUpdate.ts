import { fixedCacheKey } from "src/constants";
import { UserApi } from "../api/user";
import { v4 } from "uuid";
import { current } from "@reduxjs/toolkit";
import uuidToNumber from "src/lib/uuid2num";

export const sendMessage = ({ id, message }: { id: number; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    const ctxwin = draft.contextWindows.find((ctx) => ctx.Id === id);
    const new_msg = {
      content: message,
      ContextWindowId: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      Id: uuidToNumber(v4()),
      role: "user",
    };
    console.log("curr snd msg : ", current(ctxwin));
    console.log("send new msg : ", new_msg);

    if (ctxwin) ctxwin.ChatWindowMessages.push(new_msg);
  });
};

export const AddMessage = ({ id, message }: { id: number; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    const ctxwin = draft.contextWindows.find((ctx) => ctx.Id === id);
    if (ctxwin) {
      const last_msg = ctxwin.ChatWindowMessages[ctxwin.ChatWindowMessages.length - 1];

      if (last_msg.role === "assistant") {
        last_msg.content += message;
      } else {
        const new_msg = {
          content: message,
          ContextWindowId: id,
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
