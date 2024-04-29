import { fixedCacheKey } from "src/constants";
import { UserApi } from "../api/user";
import { v4 } from "uuid";

export const sendMessage = ({ id, message }: { id: number; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    const ctxwin = draft.contextWindows.find((ctx) => ctx.Id === id);

    if (ctxwin)
      ctxwin.ChatWindowMessages.push({
        content: message,
        ContextWindowId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        Id: Number(v4()),
        role: "user",
      });
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
        ctxwin.ChatWindowMessages.push({
          content: message,
          ContextWindowId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          Id: Number(v4()),
          role: "assistant",
        });
      }
    }
  });
};
