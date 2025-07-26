import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
export interface Sandbox {
  theme: "light" | "dark" | null;
  section: "Client" | "Server" | "Style" | "Demo";
  isRedirect: boolean;
  unsavedChanges: number;
  title?: string;
  description?: string;
  networkResponse: any[];
  tab: string | null;
  view: "developer" | "preview";
}

// Define the initial state
const initialState: Sandbox = {
  theme: null,
  section: "Server",
  isRedirect: false,
  unsavedChanges: 0,
  networkResponse: [],
  tab: null,
  view: "preview",
};

// Create the slice with typed reducers
const sandboxSlice = createSlice({
  name: "sandbox",
  initialState,
  reducers: {
    updateSandbox: (state, action: PayloadAction<Partial<any>>) => {
      return { ...state, ...action.payload };
    },
    updateTheme: (state, action: PayloadAction<"light" | "dark" | null>) => {
      state.theme = action.payload;
    },
    updateSandboxTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    updateSandboxDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    updateTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
    updateView: (
      state,
      action: PayloadAction<"developer" | "preview">
    ) => {
      state.view = action.payload;
    },
    updateSandboxSection: (
      state,
      action: PayloadAction<"Client" | "Server" | "Style" | "Demo">
    ) => {
      state.section = action.payload;
    },
    updateIsRedirect: (state, action: PayloadAction<boolean>) => {
      state.isRedirect = action.payload;
    },
    updateNetworkResponse: (state, action: PayloadAction<any>) => {
      state.networkResponse.push(action.payload);
    },
    incrementUnsavedChanges: (state) => {
      state.unsavedChanges += 1;
    },
    resetSandbox: (state) => {
      return { ...initialState };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = sandboxSlice;
