"use client";

import Error from "@/components/custom/utils/Error";
import Loading from "@/components/custom/utils/Loading";
import Result from "@/components/custom/utils/Result";
import { useAdyenAdvance } from "@/hooks/useAdyenAdvance";
import { useApi } from "@/hooks/useApi";
import { useCalculatedClasses } from "@/hooks/useCalculatedClasses";
import { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';

export const InitAdvanceComponent = (props: any) => {
  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    variant,
    txVariantConfiguration,
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    onPaymentMethodsResponse,
    onClassesCalculated,
    onChange,
    onPaymentMethodsNetworkResponse,
    onPaymentsNetworkResponse,
    onPaymentDetailsNetworkResponse,
  } = props;

  const pathname = usePathname();
  const isEmbedPage = pathname?.includes('/embed');

  const {
    data: paymentMethodsResponse,
    loading: loadingPaymentMethods,
    error: paymentMethodsError,
    response: paymentMethodsRawResponse,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion.paymentMethods}/paymentMethods`,
    "POST",
    paymentMethodsRequest
  );

  const [readyToMount, setReadyToMount] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (paymentMethodsResponse && !paymentMethodsError) {
      onPaymentMethodsResponse(paymentMethodsResponse);
      setReadyToMount(true);
    }
    if (paymentMethodsRawResponse) {
      onPaymentMethodsNetworkResponse(paymentMethodsRawResponse);
    }
  }, [paymentMethodsResponse]);

  const {
    result: adyenResult,
    error: adyenSDKError,
    hasMounted,
  }: any = useAdyenAdvance(
    variant,
    checkoutAPIVersion,
    adyenWebVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    paymentMethodsResponse,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutRef,
    onChange,
    onPaymentsNetworkResponse,
    onPaymentDetailsNetworkResponse,
    readyToMount
  );

  const {
    result: calculatedClasses,
    loading: calculatedClassesLoading,
    error: calculatedClassesError,
  } = useCalculatedClasses(checkoutRef, hasMounted);

  useEffect(() => {
    onClassesCalculated(
      calculatedClasses,
      calculatedClassesLoading,
      calculatedClassesError
    );
  }, [calculatedClasses]);

  const error =
    adyenSDKError || paymentMethodsError
      ? { ...adyenSDKError, ...paymentMethodsError }
      : null;


  return (
    <div className="flex justify-center align-center h-full">
      {error && <Error error={error} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loadingPaymentMethods && <Loading className="text-foreground" />}
      {!error && !adyenSDKError && !adyenResult && !loadingPaymentMethods && (
        <div className={"h-full w-full"}>
          <div ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
