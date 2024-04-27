import { fixedCacheKey } from "src/constants";
import { api } from ".";
import { queryInputType, uploadInputType, MessageType } from "../../types/user";
import { ContextDataType, UserDataType } from "@backend/prisma/selections";

export const UserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchData: builder.query<UserDataType, void>({
      query: () => ({
        method: "get",
        url: "/user/data",
        headers: {
          token: localStorage.getItem("token") || "",
        },
      }),
      transformResponse: (response: { user: UserDataType }) => {
        return response.user;
      },
    }),
    uploadDocument: builder.mutation<ContextDataType, uploadInputType>({
      query: (input: uploadInputType) => ({
        method: "post",
        url: "/user/upload",
        body: {
          ...input,
        },
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
        const optimistic_update = dispatch(
          UserApi.util.updateQueryData("fetchData", fixedCacheKey, (draft: UserDataType) => {
            const ctx_win = draft.contextWindows.find((ctx) => ctx.Id === Number(input.id));
            const msg_arr = JSON.parse(ctx_win?.chatMessages as string) as MessageType[];
            const new_msg: MessageType = { message: input.message, role: "user" };
            msg_arr.push(new_msg); // push the new here
            Object.assign(ctx_win?.chatMessages!, JSON.stringify(msg_arr));
          })
        );

        try {
          const res = await queryFulfilled;
          dispatch(
            UserApi.util.updateQueryData("fetchData", undefined, (draft: UserDataType) => {
              const ctx_win = draft.contextWindows.find((ctx) => ctx.Id === Number(input.id));
              const msg_arr = JSON.parse(ctx_win?.chatMessages as string) as MessageType[];
              const new_msg: MessageType = { message: res.data, role: "assistant" };
              msg_arr.push(new_msg); // push the new here
              Object.assign(ctx_win?.chatMessages!, JSON.stringify(msg_arr));
            })
          );
        } catch (error) {
          optimistic_update.undo();
        }
      },
    }),
  }),
});

export const { useQueryDocumentMutation, useFetchDataQuery, useUploadDocumentMutation } = UserApi;

export const useFetchDataFixedCache = useFetchDataQuery(fixedCacheKey);
