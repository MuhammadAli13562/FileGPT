import { api } from ".";
import { ContextDataType, UserDataType, UserMetaDataType } from "@backend/prisma/selections";

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
        console.log("user : ", response);
        return response.user;
      },
    }),
    fetchContextData: builder.query<ContextDataType, string>({
      query: (id: string) => ({
        method: "get",
        url: `/user/data/${id}`,
        headers: {
          token: localStorage.getItem("token") || "",
        },
      }),
      transformResponse: (response: { ContextWindow: ContextDataType }) => {
        console.log("fetchctx : ", response);

        return response.ContextWindow;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = (await queryFulfilled).data;
        console.log("res id : ", res);

        dispatch(
          UserApi.util.updateQueryData("fetchData", undefined, (draft: UserDataType) => {
            draft.contextWindows.push(res);
          })
        );
      },
    }),
    uploadDocument: builder.mutation<any | string, any>({
      query: (form: FormData) => ({
        method: "post",
        url: "/user/upload",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: form,
      }),
      invalidatesTags: ["META"],
      transformResponse: (response: { ContextWindow: ContextDataType }) => {
        return response.ContextWindow;
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const res = await queryFulfilled;
        dispatch(
          UserApi.util.updateQueryData("fetchData", undefined, (draft: UserDataType) => {
            draft.contextWindows.push(res.data);
          })
        );
      },
    }),
    deleteContext: builder.mutation<any | string, any>({
      query: (Id: string) => ({
        method: "delete",
        url: "/user/delete",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: { id: Id },
      }),
      invalidatesTags: ["META"],
    }),
    fetchMetaData: builder.query<UserMetaDataType, void>({
      query: () => ({
        method: "get",
        url: "/user/meta",
        headers: {
          token: localStorage.getItem("token") || "",
        },
      }),
      providesTags: ["META"],
      transformResponse: (response: { user: UserDataType }) => {
        console.log("user meta : ", response);
        return response.user;
      },
    }),
  }),
});

export const { useFetchDataQuery, useUploadDocumentMutation, useDeleteContextMutation, useFetchMetaDataQuery, useFetchContextDataQuery } = UserApi;
