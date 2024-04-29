import { fixedCacheKey } from "src/constants";
import { api } from ".";
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
  }),
});

export const { useFetchDataQuery, useUploadDocumentMutation } = UserApi;

export const useFetchDataFixedCache = () => useFetchDataQuery(fixedCacheKey);
