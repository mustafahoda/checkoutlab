"use client";
import { useAdyenSessionsRedirect } from "@/hooks/useAdyenSessionsRedirect";
import Error from "../../utils/Error";
import Loading from "../../utils/Loading";
import Result from "../../utils/Result";

export const RedirectSessionsComponent = (props: any) => {
  const { redirectResult, sessionId, checkoutConfiguration } = props;
  const { result, error, loading }: any = useAdyenSessionsRedirect(
    checkoutConfiguration,
    sessionId,
    redirectResult
  );

  return (
    <div className="flex justify-center items-center h-[100%]">
      {error && <Error error={error} />}
      {result && <Result adyenResult={result} />}
      {loading && <Loading className="text-foreground" />}
    </div>
  );
};
