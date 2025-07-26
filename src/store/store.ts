import { configureStore } from "@reduxjs/toolkit";
import {
  specsReducer,
  componentReducer,
  formulaReducer,
  sandboxReducer,
  userReducer,
} from "./reducers";

export const store = configureStore({
  reducer: {
    formula: formulaReducer,
    specs: specsReducer,
    component: componentReducer,
    sandbox: sandboxReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
