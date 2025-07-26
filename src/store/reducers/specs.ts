import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Specs {
  [key: string]: any;
}

export interface SpecsList {
  checkoutApi?: Specs | null;
  checkoutConfiguration?: Specs | null;
  txVariantConfiguration?: Specs | null;
  style?: Specs | null;
}

const initialState: SpecsList = {
  checkoutApi: null,
  checkoutConfiguration: null,
  txVariantConfiguration: null,
  style: null,
};

export const SpecsSlice = createSlice({
  name: "Adyen Integration Parameters",
  initialState,
  reducers: {
    updateSpecs: (state, action: PayloadAction<SpecsList>) => {
      return { ...state, ...action.payload };
    },
    clearSpecs: (state) => {
      state = initialState;
    },
  },
});

export const { actions, reducer } = SpecsSlice;
