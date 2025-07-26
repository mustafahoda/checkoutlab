import { useEffect, useState } from "react";

interface AdyenSessionsHook {
  error: object | null;
  result: object | null;
  hasMounted: boolean;
}

export const useAdyenSessions = (
  txVariant: string,
  checkoutAPIVersion: {
    sessions: string;
  },
  checkoutConfiguration: any,
  txVariantConfiguration: any,
  sessionsResponse: any,
  checkoutRef: any,
  onChange: any,
  readyToMount: boolean,
  adyenWebVersion: string
): AdyenSessionsHook => {
  const [error, setError] = useState<object | null>(null);
  const [result, setResult] = useState<object | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  const handlePaymentCompleted = (result: any, component: any) => {
    setResult(result);
  };
  const handleError = (error: any) => {
    setError(error);
  };
  const handleChange = (state: any) => {
    onChange(state);
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
        if (error instanceof Error) {
          setError({
            message: error.message
              ? error.message
              : "Error initializing checkout",
          });
        }
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
      "handlePaymentCompleted",
      "handleError",
      "handleChange",
      `return ${checkoutConfiguration}`
    )(handlePaymentCompleted, handleError, handleChange);

    let configuration: any = {
      ...executeConfiguration,
    };

    const executeTxVariantConfiguration = new Function(
      `return ${txVariantConfiguration}`
    )();

    if (readyToMount) {
      if (/^5./.test(adyenWebVersion)) {
        adyenV5(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      } else if (/^6./.test(adyenWebVersion)) {
        adyenV6(configuration, checkoutRef, txVariant, executeTxVariantConfiguration);
      }
    }
  }, [
    txVariant,
    txVariantConfiguration,
    sessionsResponse,
    checkoutAPIVersion,
    checkoutConfiguration,
    checkoutRef,
    readyToMount,
    adyenWebVersion,
  ]);

  return { error, result, hasMounted };
};
