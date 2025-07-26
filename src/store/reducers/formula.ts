import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sanitizeString } from "@/utils/utils";

// Define the types for properties that can be of any shape
export interface FormulaPropType {
  [key: string]: any;
}

// Define the shape of the state
export interface Formula {
  checkoutConfiguration: string;
  checkoutAPIVersion: {
    sessions: string;
    paymentMethods: string;
    payments: string;
    paymentsDetails: string;
  };
  adyenWebVersion: string;
  txVariant: string;
  txVariantConfiguration: string;
  request: {
    sessions: FormulaPropType;
    paymentMethods: FormulaPropType;
    payments: FormulaPropType;
    paymentsDetails: FormulaPropType;
  };
  response: {
    sessions: FormulaPropType;
    paymentMethods: FormulaPropType;
    payments: FormulaPropType;
    paymentsDetails: FormulaPropType;
  };
  style: string;
  isRedirect: boolean;
  unsavedChanges: {
    html: boolean;
    style: boolean;
    js: boolean;
    checkout: boolean;
    variant: boolean;
    paymentMethods: boolean;
    payments: boolean;
    paymentsDetails: boolean;
    sessions: boolean;
    events: boolean;
  };
  errors: {
    html: boolean;
    style: boolean;
    js: boolean;
    checkout: boolean;
    variant: boolean;
    paymentMethods: boolean;
    payments: boolean;
    paymentsDetails: boolean;
    sessions: boolean;
    events: boolean;
  };
  build: Formula | null;
  base: Formula | null;
  run: boolean;
  reset: boolean;
  redirectResult: string | null;
  sessionId: string | null;
  buildId: string | null;
}

// Define the initial state

const initialState: FormulaPropType = {
  checkoutAPIVersion: {
    paymentMethods: "70",
    payments: "70",
    paymentsDetails: "70",
    sessions: "70",
  },
  adyenWebVersion: "5.66.1",
  checkoutConfiguration: sanitizeString(
    `{clientKey: "${process.env.NEXT_PUBLIC_CLIENT_KEY}", environment: "test", onChange: function(state){handleChange(state);}, onError: function(error){handleError(error);}, onAdditionalDetails: function(state,dropin){handleAdditionalDetails(state,dropin);}, onSubmit: function(state,dropin){handleSubmit(state,dropin);}, onPaymentCompleted: function(state,dropin){handlePaymentCompleted(state,dropin);}}`
  ),
  txVariant: "",
  txVariantConfiguration: sanitizeString(`{}`),
  request: {
    paymentMethods: {
      merchantAccount: `${process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT}`,
    },
    payments: {
      countryCode: "US",
      amount: {
        value: 10000,
        currency: "USD",
      },
      // Bug: Need to fix this to be dynamic, we need to set the return url for each page
      returnUrl: "",
      reference: "merchant-reference",
      merchantAccount: `${process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT}`,
    },
    paymentsDetails: {},
    sessions: {
      countryCode: "US",
      amount: {
        value: 10000,
        currency: "USD",
      },
      channel: "Web",
      //TODO: Need to dynamically get the return url
      returnUrl: "",
      reference: "reference",
      shopperLocale: "en_US",
      //TODO: Fix this
      merchantAccount: `${process.env.NEXT_PUBLIC_MERCHANT_ACCOUNT}`,
    },
  },
  style: "",
  buildId: "1",
  unsavedChanges: {
    html: false,
    style: false,
    js: false,
    checkout: false,
    variant: false,
    paymentMethods: false,
    payments: false,
    paymentsDetails: false,
    sessions: false,
    events: false,
  },
  errors: {
    html: false,
    style: false,
    js: false,
    checkout: false,
    variant: false,
    paymentMethods: false,
    payments: false,
    paymentsDetails: false,
    sessions: false,
    events: false,
  },
  isRedirect: false,
  build: null,
  base: null,
  run: true,
  reset: false,
  redirectResult: null,
  sessionId: null,
};

// Add the build key to the initial state
initialState.build = { ...initialState };
initialState.base = { ...initialState };

// Create the slice with typed reducers
const formulaSlice = createSlice({
  name: "formula",
  initialState,
  reducers: {
    updateRun: (state) => {
      state.build = { ...state };
      state.run = !state.run;
    },
    updateBase: (state, action: PayloadAction<Partial<Formula>>) => {
      state.base = { ...state.base, ...action.payload };
    },
    updateFormula: (state, action: PayloadAction<Partial<Formula>>) => {
      const updatedPaymentMethodsRequest = {
        ...state.request.paymentMethods,
        ...action.payload.request?.paymentMethods,
      };
      const updatedPaymentsRequest = {
        ...state.request.payments,
        ...action.payload.request?.payments,
      };
      const updatedPaymentsDetailsRequest = {
        ...state.request.paymentsDetails,
        ...action.payload.request?.paymentsDetails,
      };
      const updatedSessionsRequest = {
        ...state.request.sessions,
        ...action.payload.request?.sessions,
      };
      const updatedRequest = {
        paymentMethods: updatedPaymentMethodsRequest,
        payments: updatedPaymentsRequest,
        paymentsDetails: updatedPaymentsDetailsRequest,
        sessions: updatedSessionsRequest,
      };

      return {
        ...state,
        ...action.payload,
        request: updatedRequest,
      };
    },
    updateCheckoutConfiguration: (state, action: PayloadAction<string>) => {
      state.checkoutConfiguration = action.payload;
    },
    addUnsavedChanges: (state, action: PayloadAction<any>) => {
      state.unsavedChanges = {
        ...state.unsavedChanges,
        ...action.payload,
      };
    },
    updateReset: (state) => {
      state.reset = !state.reset;
    },
    updateVariantReturnUrl: (state, action: PayloadAction<string>) => {
      state.request.payments.returnUrl = action.payload;
      state.request.sessions.returnUrl = action.payload;
    },
    updateBuildId: (state, action: PayloadAction<string>) => {
      state.buildId = action.payload;
    },
    resetUnsavedChanges: (state) => {
      state.unsavedChanges = {
        html: false,
        style: false,
        js: false,
        checkout: false,
        variant: false,
        paymentMethods: false,
        payments: false,
        paymentsDetails: false,
        sessions: false,
        events: false,
      };
    },
    updateCheckoutAPIVersion: (state, action: PayloadAction<any>) => {
      state.checkoutAPIVersion = {
        ...state.checkoutAPIVersion,
        ...action.payload,
      };
    },
    updateErrors: (state, action: PayloadAction<any>) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },
    updateBuildCheckoutConfiguration: (
      state,
      action: PayloadAction<string>
    ) => {
      state.build.checkoutConfiguration = action.payload;
    },
    updateBuildCheckoutReturnUrls: (state, action: PayloadAction<string>) => {
      state.build.request.payments.returnUrl = action.payload;
      state.build.request.sessions.returnUrl = action.payload;
    },
    updateBuildMerchantAccount: (state, action: PayloadAction<string>) => {
      state.build.request.paymentMethods.merchantAccount = action.payload;
      state.build.request.payments.merchantAccount = action.payload;
      state.build.request.paymentsDetails.merchantAccount = action.payload;
      state.build.request.sessions.merchantAccount = action.payload;
    },
    updateAdyenWebVersion: (state, action: PayloadAction<string>) => {
      state.adyenWebVersion = action.payload;
    },
    updateIsRedirect: (state, action: PayloadAction<boolean>) => {
      state.isRedirect = action.payload;
    },
    updateRedirectResult: (state, action: PayloadAction<string>) => {
      state.redirectResult = action.payload;
    },
    updateSessionId: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    updateTxVariant: (state, action: PayloadAction<string>) => {
      state.txVariant = action.payload;
    },
    updateApiRequestMerchantAccount: (state, action: PayloadAction<string>) => {
      state.request.paymentMethods.merchantAccount = action.payload;
      state.request.payments.merchantAccount = action.payload;
      state.request.paymentsDetails.merchantAccount = action.payload;
      state.request.sessions.merchantAccount = action.payload;
    },
    updateTxVariantConfiguration: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      state.txVariantConfiguration = action.payload;
    },
    updateStyle: (state, action: PayloadAction<FormulaPropType>) => {
      state.style = action.payload;
    },
    updateSessionsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          sessions: updatedRequest,
        },
      };
    },
    updatePaymentMethodsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          paymentMethods: updatedRequest,
        },
      };
    },
    updatePaymentsRequest: (state, action: PayloadAction<FormulaPropType>) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          payments: updatedRequest,
        },
      };
    },
    updatePaymentsDetailsRequest: (
      state,
      action: PayloadAction<FormulaPropType>
    ) => {
      const updatedRequest = {
        ...action.payload,
      };
      return {
        ...state,
        request: {
          ...state.request,
          paymentsDetails: updatedRequest,
        },
      };
    },
    resetFormula: (state) => {
      const baseConfiguration = state.base;
      const newState = {
        ...baseConfiguration,
        build: baseConfiguration,
        base: baseConfiguration,
        run: !state.run,
        reset: state.reset,
        unsavedChanges: {
          html: false,
          style: false,
          js: false,
          checkout: false,
          variant: false,
          paymentMethods: false,
          payments: false,
          paymentsDetails: false,
          sessions: false,
          events: false,
        },
      };

      return newState;
    },
    clearOnDeckInfo: (state) => {
      const lastBuild = state.build;
      return {
        ...lastBuild,
        build: lastBuild,
        run: state.run,
        base: state.base,
        reset: state.reset,
        unsavedChanges: {
          html: false,
          style: false,
          js: false,
          checkout: false,
          variant: false,
          paymentMethods: false,
          payments: false,
          paymentsDetails: false,
          sessions: false,
          events: false,
        },
      };
    },
  },
});

// Export actions and reducer
export const { actions, reducer } = formulaSlice;
