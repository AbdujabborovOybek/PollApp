import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api.service";

const user = JSON.parse(localStorage.getItem("user")) || null;

export const store = configureStore({
  reducer: combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,

    user: (state = user, action) => {
      switch (action.type) {
        case "SET_USER":
          return action.payload;
        case "LOGOUT_USER":
          return null;
        default:
          return state;
      }
    },
  }),

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
