import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const userAPISlice = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include", // Globally include credentials for all requests & Include cookies in requests
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userInfo.dynamicToken; // Assume token is stored in Redux state
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Basic ${btoa(`user:${token}`)}`);
      }
      return headers;
    },
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data) => ({
        url: "/backend/authentication/store",
        method: "post",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/backend/authentication/login",
        method: "post",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/backend/authentication/forgot-password",
        method: "post",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/backend/authentication/change-password",
        method: "post",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useLoginUserMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = userAPISlice;
