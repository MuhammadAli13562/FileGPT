import { fixedCacheKey } from "src/constants";
import { createSelector } from "@reduxjs/toolkit";
import { UserApi } from "../api/user";

export const SelectUserResult = UserApi.endpoints.fetchData.select(fixedCacheKey);
export const SelectUserMetaResult = UserApi.endpoints.fetchMetaData.select(fixedCacheKey);

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

export const SelectAllMetaContextWindows = createSelector(
  SelectUserMetaResult,
  (userResult) => userResult.data?.contextWindows ?? []
);

export const SelectMetaContextWindowById = createSelector(
  [SelectAllMetaContextWindows, (_, Id: string) => Id],
  (contextWindows, Id) => {
    return contextWindows.find((ctx_win) => ctx_win.fileKey === Id);
  }
);
