import { api } from ".";
import { SignInCreds, SignInReturns, SignUpCreds, SignUpReturns } from "../../types/auth";

const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    SignInUser: builder.mutation<SignInReturns, SignInCreds>({
      query: (creds: SignInCreds) => ({
        method: "post",
        url: "/auth/login",
        body: {
          ...creds,
        },
      }),
      transformResponse: async (response: Response, meta) => {
        const token = meta?.response?.headers.get("token") || "";
        const status = meta?.response?.status || 0;
        return { response, token, status };
      },
    }),
    SignUpUser: builder.mutation<SignUpReturns, SignUpCreds>({
      query: (creds: SignUpCreds) => ({
        method: "post",
        url: "/auth/register",
        body: {
          ...creds,
        },
      }),
      transformResponse: async (response: Response, meta) => {
        const token = meta?.response?.headers.get("token") || "";
        const status = meta?.response?.status || 0;
        return { response, token, status };
      },
    }),
    VerifyUserLogin: builder.mutation<Response, void>({
      query: () => ({
        method: "get",
        url: "/auth/verify",
        headers: {
          token: localStorage.getItem("token") || "",
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSignInUserMutation, useSignUpUserMutation, useVerifyUserLoginMutation } = AuthApi;
