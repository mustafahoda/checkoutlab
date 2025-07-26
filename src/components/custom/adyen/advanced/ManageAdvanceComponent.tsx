"use client";

import { InitAdvanceComponent } from "@/components/custom/adyen/advanced/InitAdvanceComponent";
import { RedirectAdvanceComponent } from "@/components/custom/adyen/advanced/RedirectAdvanceComponent";
import useAdyenScript from "@/hooks/useAdyenScript";
import {
  componentActions,
  formulaActions,
  sandboxActions,
  specsActions,
} from "@/store/reducers";
import type { RootState } from "@/store/store";
import { stringifyObject, unstringifyObject } from "@/utils/utils";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../utils/Loading";

const {
  updateIsRedirect,
  updateRedirectResult,
  updateCheckoutConfiguration,
  updateBuildCheckoutConfiguration,
  updateReset,
} = formulaActions;
const { updateComponentState, updateResponse } = componentActions;
const { updateSpecs } = specsActions;
const { updateNetworkResponse } = sandboxActions;

export const ManageAdvanceComponent = (props: any) => {
  const { className } = props;
  const { build, isRedirect, redirectResult } = useSelector(
    (state: RootState) => state.formula
  );

  const {
    checkoutConfiguration,
    checkoutAPIVersion,
    adyenWebVersion,
    txVariantConfiguration,
    request,
  } = build;
  const { paymentMethods, payments, paymentsDetails } = request;
  const { error: adyenScriptError, loading: loadingAdyenScript } =
    useAdyenScript(adyenWebVersion);

  const dispatch = useDispatch();
  const { variant } = useParams<{
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const redirectResultQueryParameter = searchParams.get("redirectResult");
  useEffect(() => {
    if (redirectResultQueryParameter && !isRedirect) {
      dispatch(updateIsRedirect(true));
      dispatch(updateRedirectResult(redirectResultQueryParameter));
    }
  }, [redirectResultQueryParameter, isRedirect]);

  if (loadingAdyenScript || !variant) {
    return <Loading className="text-foreground" />;
  }

  if (adyenScriptError) {
    // Need to add an error that we are not able to download adyen script or the specs
    return <div>Error</div>;
  }

  return (
    <div className={`h-full ${className}`}>
      {!isRedirect && (
        <InitAdvanceComponent
          checkoutAPIVersion={checkoutAPIVersion}
          adyenWebVersion={adyenWebVersion}
          checkoutConfiguration={checkoutConfiguration}
          variant={variant}
          txVariantConfiguration={txVariantConfiguration}
          paymentMethodsRequest={paymentMethods}
          paymentsRequest={payments}
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
          paymentsDetailsRequest={paymentsDetails}
          onPaymentMethodsResponse={(response: any) => {
            if (response) {
              let evaluatedCheckoutConfiguration = unstringifyObject(
                checkoutConfiguration
              );
              evaluatedCheckoutConfiguration.paymentMethodsResponse = {
                ...response,
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
              dispatch(updateResponse({ paymentMethods: { ...response } }));
              dispatch(updateReset());
            }
          }}
          onPaymentMethodsNetworkResponse={(response: any) => {
            dispatch(updateNetworkResponse(response));
          }}
          onPaymentsNetworkResponse={(response: any) => {
            dispatch(updateNetworkResponse(response));
          }}
          onPaymentDetailsNetworkResponse={(response: any) => {
            dispatch(updateNetworkResponse(response));
          }}
        />
      )}

      {isRedirect && redirectResult && (
        <RedirectAdvanceComponent
          variant={variant}
          redirectResult={redirectResult}
          checkoutAPIVersion={checkoutAPIVersion}
          paymentsDetailsRequest={paymentsDetails}
          onPaymentDetailsNetworkResponse={(response: any) => {
            dispatch(updateNetworkResponse(response));
          }}
        />
      )}
    </div>
  );
};
