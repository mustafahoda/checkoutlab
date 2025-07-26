"use client";

import { useAdyenAdvanceRedirect } from "@/hooks/useAdyenAdvanceRedirect";
import Error from "../../utils/Error";
import Loading from "../../utils/Loading";
import Result from "../../utils/Result";
import { useEffect } from "react";

export const RedirectAdvanceComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    variant,
    paymentsDetailsRequest,
    redirectResult,
    onPaymentDetailsNetworkResponse,
  } = props;

  const {
    result: adyenResult,
    error: adyenSDKError,
    loading,
    response,
  }: any = useAdyenAdvanceRedirect(
    variant,
    checkoutAPIVersion,
    paymentsDetailsRequest,
    redirectResult,
  );

  useEffect(() => {
    if (response) {
      onPaymentDetailsNetworkResponse(response);
    }
  }, [response]);

  return (
    <div className="flex justify-center items-center h-[100%]">
      {adyenSDKError && <Error error={adyenSDKError} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loading && <Loading className="text-foreground" />}
    </div>
  );
};
