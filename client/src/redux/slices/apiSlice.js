import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:8800/api"; // Your API URL

export const apiSlice = createApi({
  reducerPath: 'api', // Unique string identifying this slice
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['User', 'Post'], // Define tag types if needed
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `user/${id}`, // Example endpoint
    }),
    getPosts: builder.query({
      query: () => 'posts', // Example endpoint
    }),
    // Define other endpoints as needed
  }),
});

export const { useGetUserQuery, useGetPostsQuery } = apiSlice;
