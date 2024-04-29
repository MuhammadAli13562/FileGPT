import { fixedCacheKey } from "src/constants";
import { api } from ".";
import { current } from "@reduxjs/toolkit";
import { queryInputType } from "../../types/user";
import { ContextDataType, UserDataType } from "@backend/prisma/selections";

export const UserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchData: builder.query<UserDataType, void>({
      query: () => ({
        method: "get",
        url: "/user/data",
        headers: {
          //token: localStorage.getItem("token") || "",
        },
      }),
      transformResponse: (response: { user: UserDataType }) => {
        console.log("user : ", response);
        return response.user;
      },
    }),
    uploadDocument: builder.mutation<any | string, any>({
      query: (form: FormData) => ({
        method: "post",
        url: "/user/upload",
        body: form,
      }),
      transformResponse: (response: { ContextWindow: ContextDataType }) => {
        return response.ContextWindow;
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft: UserDataType) => {
            draft.contextWindows.push(res.data);
          })
        );
      },
    }),
    queryDocument: builder.mutation<string, queryInputType>({
      query: (input: queryInputType) => ({
        method: "post",
        url: "/user/query",
        body: {
          ...input,
        },
      }),

      async onQueryStarted(input, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
            const contextWindow = draft.contextWindows.find((ctx) => ctx.Id === input.id);

            const newMessage = {
              Id: -99,
              content: input.message,
              role: "user",
              createdAt: new Date(),
              updatedAt: new Date(),
              ContextWindowId: input.id,
            };
            if (contextWindow) contextWindow?.ChatWindowMessages.push(newMessage);
          })
        );
        try {
          //const response = (await queryFulfilled).data;

          // actual updates

          dispatch(
            UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft) => {
              const contextWindow = draft.contextWindows.find((ctx) => ctx.Id === input.id);
              if (contextWindow) {
                contextWindow.ChatWindowMessages.pop();
                //contextWindow.ChatWindowMessages.push()
              }
            })
          );
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useQueryDocumentMutation, useFetchDataQuery, useUploadDocumentMutation } = UserApi;

export const useFetchDataFixedCache = () => useFetchDataQuery(fixedCacheKey);
