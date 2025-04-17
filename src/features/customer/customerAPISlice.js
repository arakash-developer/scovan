import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const customerAPISlice = createApi({
  reducerPath: "customerAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userInfo.dynamicToken;
      console.log("token", token);
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Basic ${btoa(`user:${token}`)}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Customers"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => ({
        url: "/backend/customer/all",
        method: "get",
      }),
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query({
      query: (id) => ({
        url: `/backend/customer/edit/${id}`,
        method: "get",
      }),
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: "/backend/customer/store",
        method: "post",
        body: data,
      }),
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: "/backend/customer/update",
        method: "post",
        body: data,
      }),
    }),
    deleteCustomer: builder.mutation({
      query: (data) => ({
        url: "/backend/customer/destroy",
        method: "post",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerAPISlice;
