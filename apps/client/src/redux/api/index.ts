import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServerEndpoint } from "../../constants";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: ServerEndpoint,
  }),
  tagTypes: ["META"],
  endpoints: () => ({}),
});
