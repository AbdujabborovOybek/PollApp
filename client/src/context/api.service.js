import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { retry } from "@reduxjs/toolkit/query/react";

// RTK Query uchun bazaviy so'rov konfiguratsiyasi
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8080/api",
  credentials: "include",
});

// Token muddati tugagan yoki noto'g'ri bo'lsa, foydalanuvchini qayta avtorizatsiya qilish
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
  }
  return result;
};

// baseQueryWithReauth ni retry() bilan o'ramiz, maksimal 2 marta uriniladi
const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 2 });

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry, // retry bilan o'ralgan versiyasini ishlatamiz
  tagTypes: ["update_poll"],
  endpoints: (builder) => ({}),
});
