import { apiSlice } from "../api.service";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Auth verification POST - /api/auth/verify
    verify: builder.mutation({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Auth logout POST - /api/auth/logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useVerifyMutation, useLogoutMutation } = authApi;
