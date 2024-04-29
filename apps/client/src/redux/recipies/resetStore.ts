import { fixedCacheKey } from "src/constants";
import { UserApi } from "../api/user";

export const resetStore = () =>
  UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    draft.contextWindows[0].ChatWindowMessages.push({
      content: "Hey what up",
      ContextWindowId: 6,
      Id: 99,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

export const sendMessage = ({ id, message }: { id: number; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    const ctxwin = draft.contextWindows.find((ctx) => ctx.Id === id);

    if (ctxwin)
      ctxwin.ChatWindowMessages.push({
        content: message,
        ContextWindowId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
        Id: -100,
        role: "user",
      });
  });
};

export const AddMessage = ({ id, message }: { id: number; message: string }) => {
  return UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
    const ctxwin = draft.contextWindows.find((ctx) => ctx.Id === id);
    if (ctxwin) {
      const last_msg = ctxwin.ChatWindowMessages[ctxwin.ChatWindowMessages.length - 1];
      if (last_msg.Id === -200) {
        last_msg.content += message;
      } else {
        ctxwin.ChatWindowMessages.push({
          content: message,
          ContextWindowId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          Id: -200,
          role: "assistant",
        });
      }
    }
  });
};
