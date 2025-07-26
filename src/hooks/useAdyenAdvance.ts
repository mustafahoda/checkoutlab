import { useEffect, useState } from "react";

interface AdyenAdvanceHook {
  error: object | null;
  result: object | null;
  hasMounted: boolean;
}

export const useAdyenAdvance = (
  txVariant: string,
  checkoutAPIVersion: {
    paymentMethods: string;
    payments: string;
    paymentsDetails: string;
  },
  adyenWebVersion: string,
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  paymentMethodsResponse: any,
  paymentsRequest: any,
  paymentsDetailsRequest: any,
  checkoutRef: any,
  onChange: any,
  onPaymentsNetworkResponse: any,
  onPaymentDetailsNetworkResponse: any,
  readyToMount: boolean
): AdyenAdvanceHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const handleSubmit = async (state: any, dropin: any) => {
    const response = await fetch(
      `/api/checkout/v${checkoutAPIVersion.payments}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentsRequest,
          ...state.data,
        }),
      }
    );
    const paymentResponse = await response.json();
    onPaymentsNetworkResponse({ url: response.url, status: response.status, method: "POST", data: paymentResponse, time: new Date().toISOString() });
    if (paymentResponse.status >= 400) {
      setError({
        status: paymentResponse?.status,
        pspReference: paymentResponse?.pspReference,
        message: paymentResponse?.message
          ? paymentResponse.message
          : "Error retrieving /paymentMethods response",
      });
    } else if (paymentResponse.action) {
      dropin.handleAction(paymentResponse.action);
      if (paymentResponse.pspReference) {
        window.checkoutLab = {
          psp: paymentResponse.pspReference
        }
      }
    } else {
      setResult(paymentResponse);
    }
  };

  const handleAdditionalDetails = async (state: any, dropin: any) => {
    let request = {
      ...paymentsDetailsRequest,
      ...state.data,
    }
    const response = await fetch(
      `/api/checkout/v${checkoutAPIVersion.paymentsDetails}/payment/details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    const paymentDetailsResponse = await response.json();
    onPaymentDetailsNetworkResponse({ url: response.url, status: response.status, method: "POST", data: paymentDetailsResponse, time: new Date().toISOString() });
    if (paymentDetailsResponse.statusCode >= 400) {
      setError({
        status: paymentDetailsResponse?.status,
        pspReference: paymentDetailsResponse?.pspReference,
        message: paymentDetailsResponse?.message
          ? paymentDetailsResponse.message
          : "Error retrieving /paymentMethods response",
      });
    } else if (paymentDetailsResponse.action) {
      dropin.handleAction(paymentDetailsResponse.action);
    } else {
      setResult(paymentDetailsResponse);
    }
  };
  const handleError = (error: any) => {
    setError(error);
  };

  const handleChange = (state: any) => {
    onChange(state);
  };
  const adyenV3 = (
    configuration: any,
    checkoutRef: any,
    txVariant: string,
    txVariantConfiguration: any
  ) => {
    try {
      const initCheckout: any = async () => {
        try {
          const checkout = new (window as any).AdyenCheckout(configuration);
          const component = checkout.create(txVariant, {
            ...txVariantConfiguration,
          });
          component.mount(checkoutRef.current);
          setHasMounted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError({
              message: error.message
                ? error.message
                : "Error mounting component",
            });
          }
        }
      };
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError({
          message: error.message
            ? error.message
            : "Error initializing checkout",
        });
      }
    }
  };

  const adyenV4 = (
    configuration: any,
    checkoutRef: any,
    txVariant: string,
    txVariantConfiguration: any
  ) => {
    try {
      const initCheckout: any = async () => {
        try {
          const checkout = new (window as any).AdyenCheckout(configuration);
          const component = checkout.create(txVariant, {
            ...txVariantConfiguration,
          });
          component.mount(checkoutRef.current);
          setHasMounted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError({
              message: error.message
                ? error.message
                : "Error mounting component",
            });
          }
        }
      };
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError({
          message: error.message
            ? error.message
            : "Error initializing checkout",
        });
      }
    }
  };

  const adyenV5 = (
    configuration: any,
    checkoutRef: any,
    txVariant: string,
    txVariantConfiguration: any
  ) => {
    try {
      const initCheckout: any = async () => {
        try {
          const checkout = await (window as any).AdyenCheckout(configuration);
          const component = checkout.create(txVariant, {
            ...txVariantConfiguration,
          });
          component.mount(checkoutRef.current);
          setHasMounted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError({
              message: error.message
                ? error.message
                : "Error mounting component",
            });
          }
        }
      };
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError({
          message: error.message
            ? error.message
            : "Error initializing checkout",
        });
      }
    }
  };

  const adyenV6 = (
    configuration: any,
    checkoutRef: any,
    txVariant: string,
    txVariantConfiguration: any
  ) => {
    try {
      const initCheckout: any = async () => {
        const { AdyenCheckout, Dropin, createComponent } = await (window as any).AdyenWeb;
        let component = null;
        try {
          const checkout = await AdyenCheckout(configuration);
          if (txVariant === "dropin") {
            component = new Dropin(checkout, txVariantConfiguration).mount(checkoutRef.current);
          } else {
            component = createComponent(txVariant, checkout, {
              ...txVariantConfiguration,
            }).mount(checkoutRef.current);
          }
          setHasMounted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError({
              message: error.message
                ? error.message
                : "Error mounting component",
            });
          }
        }
      }
      if (checkoutRef.current) {
        initCheckout();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError({
          message: error.message
            ? error.message
            : "Error initializing checkout",
        });
      }
    }
  }

  useEffect(() => {
    const executeConfiguration = new Function(
      "handleSubmit",
      "handleAdditionalDetails",
      "handleError",
      "handleChange",
      `return ${checkoutConfiguration}`
    )(handleSubmit, handleAdditionalDetails, handleError, handleChange);

    let configuration: any = {
      ...executeConfiguration,
    };

    const executeTxVariantConfiguration = new Function(
      `return ${txVariantConfiguration}`
    )();

    if (readyToMount) {
      if (/^3./.test(adyenWebVersion)) {
        adyenV3(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      } else if (/^4./.test(adyenWebVersion)) {
        adyenV4(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      } else if (/^5./.test(adyenWebVersion)) {
        adyenV5(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      } else if (/^6./.test(adyenWebVersion)) {
        adyenV6(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      }
    }
  }, [
    txVariant,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
    readyToMount,
    adyenWebVersion,
  ]);

  return { error, result, hasMounted };
};
