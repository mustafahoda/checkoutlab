"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { componentActions, formulaActions, sandboxActions, specsActions } from "@/store/reducers";
import useAdyenScript from "@/hooks/useAdyenScript";
import { useParams, useSearchParams } from "next/navigation";
import { InitSessionsComponent } from "./InitSessionsComponent";
import { RedirectSessionsComponent } from "./RedirectSessionsComponent";
import { useEffect } from "react";
import Loading from "../../utils/Loading";
import { stringifyObject } from "@/utils/utils";
import { unstringifyObject } from "@/utils/utils";

const {
  updateIsRedirect,
  updateRedirectResult,
  updateSessionId,
  updateCheckoutConfiguration,
  updateBuildCheckoutConfiguration,
  updateReset,
} = formulaActions;
const { updateComponentState, updateResponse } = componentActions;
const { updateSpecs } = specsActions;
const { updateNetworkResponse } = sandboxActions;
export const ManageAdyenSessions = (props: any) => {
  const { className } = props;
  const { build, isRedirect, redirectResult, sessionId } = useSelector(
    (state: RootState) => state.formula
  );

  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    request,
  } = build;

  const { sessions } = request;

  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get("redirectResult");
  const sessionIdQueryParameter = searchParams.get("sessionId");

  useEffect(() => {
    if (redirectResultQueryParameter && !isRedirect) {
      dispatch(updateIsRedirect(true));
      dispatch(updateRedirectResult(redirectResultQueryParameter));
      dispatch(updateSessionId(sessionIdQueryParameter));
    }
  }, [redirectResultQueryParameter, isRedirect]);

  if (loadingAdyenScript || !variant) {
    return <Loading className="text-foreground hidden" />;
  }

  if (adyenScriptError) {
    //TODO: Create Error Component
    return <div>Error...</div>;
  }
  
  return (
    <div className={`h-[100%] ${className}`}>
      {!isRedirect && (
        <InitSessionsComponent
          checkoutAPIVersion={checkoutAPIVersion}
          adyenWebVersion={adyenWebVersion}
          checkoutConfiguration={checkoutConfiguration}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          sessionsRequest={sessions}
          onChange={(state: any) => {
            dispatch(updateComponentState(state));
          }}
          onClassesCalculated={(classes: any, loading: boolean, error: any) => {
            if (classes && !error) {
              dispatch(
                updateSpecs({
                  style: classes,
                })
              );
            } else if (loading) {
              dispatch(
                updateSpecs({
                  style: null,
                })
              );
            }
          }}
          onSessionsResponse={(response: any) => {
            if (response) {
              let evaluatedCheckoutConfiguration = unstringifyObject(
                checkoutConfiguration
              );
              evaluatedCheckoutConfiguration.session = {
                id: response.id,
                sessionData: response.sessionData,
              };
              dispatch(
                updateBuildCheckoutConfiguration(
                  stringifyObject(evaluatedCheckoutConfiguration)
                )
              );
              dispatch(
                updateCheckoutConfiguration(
                  stringifyObject(evaluatedCheckoutConfiguration)
                )
              );
              dispatch(updateResponse({ sessions: { ...response } }));
              dispatch(updateReset());
            }
          }}
          onSessionsNetworkResponse={(response: any) => {
            dispatch(updateNetworkResponse(response));
          }}
        />
      )}

      {/*  Redirect Handler */}
      {isRedirect && redirectResult && sessionId && (
        <RedirectSessionsComponent
          checkoutAPIVersion={checkoutAPIVersion}
          variant={variant}
          redirectResult={redirectResult}
          sessionId={sessionId}
          checkoutConfiguration={checkoutConfiguration}
        />
      )}
    </div>
  );
};
