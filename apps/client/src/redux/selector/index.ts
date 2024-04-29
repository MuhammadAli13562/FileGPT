import { fixedCacheKey } from "src/constants";
import { createSelector } from "@reduxjs/toolkit";
import { UserApi } from "../api/user";

export const SelectUserResult = UserApi.endpoints.fetchData.select(fixedCacheKey);

export const SelectAllContextWindows = createSelector(
  SelectUserResult,
  (userResult) => userResult.data?.contextWindows ?? []
);

export const SelectContextWindowById = createSelector(
  [SelectAllContextWindows, (_, Id: string) => Id],
  (contextWindows, Id) => {
    return contextWindows.find((ctx_win) => ctx_win.fileKey === Id);
  }
);

export const SelectContextWindowMeta = createSelector(
  [SelectAllContextWindows],
  (contextWindows) => {
    return contextWindows.map((ctx_win) => {
      const contextWindowMetaData = {
        Id: ctx_win.Id,
        createdAt: ctx_win.createdAt,
        updatedAt: ctx_win.updatedAt,
        fileName: ctx_win.fileName,
        fileURL: ctx_win.fileURL,
        fileKey: ctx_win.fileKey,
      };
      return contextWindowMetaData;
    });
  }
);

// export const SelectContextWindowMetaById = createSelector(
//   [SelectAllContextWindows, (_, Id: string) => Id],
//   (contextWindows, Id) => {
//     const ctx_win = contextWindows.find((ctx) => ctx.fileKey === Id);

//     if (ctx_win)
//       return {
//         Id: ctx_win.Id,
//         createdAt: ctx_win.createdAt,
//         updatedAt: ctx_win.updatedAt,
//         fileName: ctx_win.fileName,
//         fileURL: ctx_win.fileURL,
//         fileKey: ctx_win.fileKey,
//       };
//   }
// );
