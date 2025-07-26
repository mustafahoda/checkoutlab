"use client";

import Error from "@/components/custom/utils/Error";
import Loading from "@/components/custom/utils/Loading";
import Result from "@/components/custom/utils/Result";
import { useAdyenSessions } from "@/hooks/useAdyenSessions";
import { useApi } from "@/hooks/useApi";
import { useCalculatedClasses } from "@/hooks/useCalculatedClasses";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const InitSessionsComponent = (props: any) => {
  const {
    checkoutAPIVersion,
    adyenWebVersion,
    checkoutConfiguration,
    variant,
    txVariantConfiguration,
    sessionsRequest,
    onSessionsResponse,
    onClassesCalculated,
    onChange,
    onSessionsNetworkResponse,
  } = props;

  const pathname = usePathname();
  const isEmbedPage = pathname?.includes("/embed");

  const {
    data: sessionsResponse,
    loading: loadingSessions,
    error: sessionError,
    response: sessionsRawResponse,
  } = useApi(
    `api/checkout/v${checkoutAPIVersion.sessions}/sessions`,
    "POST",
    sessionsRequest
  );
  const [readyToMount, setReadyToMount] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (sessionsResponse && !sessionError) {
      onSessionsResponse(sessionsResponse);
      setReadyToMount(true);
    }
    if (sessionsRawResponse) {
      onSessionsNetworkResponse(sessionsRawResponse);
    }
  }, [sessionsResponse]);

  const {
    result: adyenResult,
    error: adyenSDKError,
    hasMounted,
  }: any = useAdyenSessions(
    variant,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    sessionsResponse,
    checkoutRef,
    onChange,
    readyToMount,
    adyenWebVersion
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
    adyenSDKError || sessionError
      ? { ...adyenSDKError, ...sessionError }
      : null;

  return (
    <div className="flex justify-center align-center h-[100%]">
      {error && <Error error={error} />}
      {adyenResult && <Result adyenResult={adyenResult} />}
      {loadingSessions && <Loading className="text-foreground" />}
      {!error && !adyenSDKError && !adyenResult && !loadingSessions && (
        <div className="h-[100%] w-[100%]">
          <div ref={checkoutRef}></div>
        </div>
      )}
    </div>
  );
};
