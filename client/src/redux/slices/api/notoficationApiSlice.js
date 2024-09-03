import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notoficationApiSlice = createApi({
  reducerPath: 'notoficationApi', // Ensure this matches the path used in the store
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust base URL as needed
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
    }),
    markNotiAsRead: builder.mutation({
      query: ({ type, id }) => ({
        url: '/notifications/read',
        method: 'POST',
        body: { type, id },
      }),
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotiAsReadMutation } = notoficationApiSlice;
