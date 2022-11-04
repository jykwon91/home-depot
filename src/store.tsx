import { configureStore } from "@reduxjs/toolkit";
// import guesserReducer from "./features/guesserSlice";

export const store = configureStore({
  reducer: {
    // guesser: guesserReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
