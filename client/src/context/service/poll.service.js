import { apiSlice } from "../api.service";

export const pollApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Poll POST - /api/poll/create
    createPoll: builder.mutation({
      query: (data) => ({
        url: "/poll/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["update_poll"],
    }),

    // Get Polls GET - /api/poll/get?status=all&poll_type=all
    getPolls: builder.query({
      query: ({ status = "all", type_of_poll = "all" }) => ({
        url: `/poll/get?status=${status}&type_of_poll=${type_of_poll}`,
      }),
      providesTags: ["update_poll"],
    }),
  }),
});

export const { useCreatePollMutation, useGetPollsQuery } = pollApi;
