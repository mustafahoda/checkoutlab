"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import { ManageAdyenSessions } from "@/components/custom/adyen/sessions/ManageAdyenSessions";
import CheckoutPage from "@/components/custom/checkout/CheckoutPage";
import CheckoutPageMobile from "@/components/custom/checkout/CheckoutPageMobile";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import Sidebar from "@/components/custom/sandbox/navbars/Sidebar";
import Topbar from "@/components/custom/sandbox/navbars/Topbar";
import Api from "@/components/custom/sandbox/tabs/Api";
import Network from "@/components/custom/sandbox/tabs/Network";
import Sdk from "@/components/custom/sandbox/tabs/Sdk";
import StateData from "@/components/custom/sandbox/tabs/StateData";
import Style from "@/components/custom/sandbox/tabs/Style";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import useMerchantInCookie from "@/hooks/useMerchantInCookie";
import { useRefreshWarning } from '@/hooks/useRefreshWarning';
import { useSection } from "@/hooks/useSection";
import { useStyle } from "@/hooks/useStyle";
import { useTab } from "@/hooks/useTab";
import useThemeInStorage from '@/hooks/useThemeInCookie';
import { useView } from "@/hooks/useView";
import { formulaActions, sandboxActions, userActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface SectionType {
  section: "Client" | "Server" | "Style" | "Demo";
}

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
  updateSessionsRequest,
  updateCheckoutConfiguration,
  updateTxVariantConfiguration,
  updateStyle,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
  updateReset,
} = formulaActions;

const { updateMerchantAccount } = userActions;
const { updateSandboxSection } = sandboxActions;

const Page: any = () => {
  const { defaultMerchantAccount, merchantAccount, logs } = useSelector(
    (state: RootState) => state.user
  );
  const { section, theme, view } = useSelector((state: RootState) => state.sandbox);
  const { integration, variant } = useParams<{
    integration: string;
    variant: string;
  }>();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const sectionParam = searchParams.get("section");
  const tabParam = searchParams.get("tab");

  const { formulaLoading, formulaError, formulaSuccess } = useFormula(
    variant,
    view,
    integration,
    section
  );

  const {
    run,
    unsavedChanges,
    request,
    checkoutAPIVersion,
    checkoutConfiguration,
    txVariantConfiguration,
    buildId,
    style,
  } = useSelector((state: RootState) => state.formula);
  useView(viewParam);
  useSection(sectionParam);
  useTab(tabParam);
  useThemeInStorage();
  useRefreshWarning();

  const { paymentMethods, payments, paymentsDetails, sessions } = request;
  const {
    loading: styleLoading,
    error: styleError,
    success: styleSuccess,
  } = useStyle(variant, style);

  const {
    paymentMethods: paymentMethodsAPIVersion,
    payments: paymentsAPIVersion,
    paymentsDetails: paymentsDetailsAPIVersion,
    sessions: sessionsAPIVersion,
  } = checkoutAPIVersion;

  const dispatch = useDispatch();

  useMerchantInCookie(defaultMerchantAccount, (merchantAccount: string) => {
    dispatch(updateApiRequestMerchantAccount(merchantAccount));
    dispatch(updateBuildMerchantAccount(merchantAccount));
    dispatch(updateMerchantAccount(merchantAccount));
    dispatch(updateReset());
  });

  let tabsMap: any = [];
  let crumbs: Array<string> = [];
  let topRightTabsMap =
    integration === "advance"
      ? [
        {
          title: `${variant}`,
          icon: (
            <span className="font-semibold px-1 text-xxs text-adyen">
              {integration.toUpperCase()}
            </span>
          ),
          content: (
            <div className="pr-6 md:pr-0">
              <ManageAdvanceComponent key={run ? "run" : "default"} />
            </div>
          ),
          value: variant,
        },
      ]
      : integration === "sessions"
        ? [
          {
            title: `${variant}`,
            icon: (
              <span className="font-semibold px-1 text-xxs text-adyen">
                {integration.toUpperCase()}
              </span>
            ),
            content: (
              <div className="pr-6 md:pr-0">
                <ManageAdyenSessions key={run ? "run" : "default"} />
              </div>
            ),
            value: variant,
          },
        ]
        : [];

  let bottomRightTabsMap = [
    {
      title: `${variant}`,
      icon: (
        <span className="font-semibold px-1 text-xxs text-info">STATE</span>
      ),
      content: <StateData theme={theme} />,
      value: "state",
    },
    {
      title: `logs`,
      icon: <span className="font-semibold px-1 text-xxs text-info">NETWORK</span>,
      content: <Network theme={theme} />,
      value: "network",
    }
  ];

  if (theme === null) {
    return null;
  }

  if (section === "Client") {
    tabsMap = [
      {
        title: "checkout",
        icon: (
          <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
        ),
        content: (
          <Sdk
            storeConfiguration={checkoutConfiguration}
            updateStoreConfiguration={updateCheckoutConfiguration}
            configurationType="checkoutConfiguration"
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            key={"checkout"}
            description={"Create a configuration object for Checkout"}
          />
        ),
        value: `checkout`,
        unsavedChanges: unsavedChanges.checkout,
      },
      {
        title: `${variant}`,
        icon: (
          <span className="font-semibold px-1 text-xxs text-js">{"JS"}</span>
        ),
        content: (
          <Sdk
            storeConfiguration={txVariantConfiguration}
            updateStoreConfiguration={updateTxVariantConfiguration}
            configurationType="txVariantConfiguration"
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            key={"variant"}
            description={`Create a configuration object for ${variant}`}
          />
        ),
        value: `${variant}`,
        unsavedChanges: unsavedChanges.variant,
      },
    ];
    crumbs = [integration, variant, "sdk"];
  } else if (section === "Server") {
    tabsMap =
      integration === "advance"
        ? [
          {
            title: "/paymentMethods",
            icon: (
              <span className="font-semibold px-1 text-xxs text-adyen">
                POST
              </span>
            ),
            content: (
              <Api
                api="paymentMethods"
                schema="PaymentMethodsRequest"
                request={paymentMethods}
                updateRequest={updatePaymentMethodsRequest}
                description={
                  "Configure the request for the payment methods endpoint"
                }
              />
            ),
            value: "paymentmethods",
            unsavedChanges: unsavedChanges.paymentMethods,
          },
          {
            title: "/payments",
            icon: (
              <span className="font-semibold px-1 text-xxs text-adyen">
                POST
              </span>
            ),
            content: (
              <Api
                api="payments"
                schema="PaymentRequest"
                request={payments}
                updateRequest={updatePaymentsRequest}
                description={
                  "Configure the request for the payments endpoint"
                }
              />
            ),
            value: "payments",
            unsavedChanges: unsavedChanges.payments,
          },
          {
            title: "/payments/details",
            icon: (
              <span className="font-semibold px-1 text-xxs text-adyen">
                POST
              </span>
            ),
            content: (
              <Api
                api="paymentsDetails"
                schema="PaymentDetailsRequest"
                request={paymentsDetails}
                updateRequest={updatePaymentsDetailsRequest}
                description={
                  "Configure the request for the payment details endpoint"
                }
              />
            ),
            value: "paymentsDetails",
            unsavedChanges: unsavedChanges.paymentsDetails,
          },
        ]
        : integration === "sessions"
          ? [
            {
              title: `/v${sessionsAPIVersion}/sessions`,
              icon: (
                <span className="font-semibold px-1 text-xxs text-adyen">
                  {"POST"}
                </span>
              ),
              content: (
                <Api
                  api="sessions"
                  schema="CreateCheckoutSessionRequest"
                  request={sessions}
                  updateRequest={updateSessionsRequest}
                  description={"Create a /sessions request"}
                />
              ),
              value: "sessions",
              unsavedChanges: unsavedChanges.sessions,
            },
          ]
          : [];
    crumbs = [integration, variant, "api"];
  } else if (section === "Style") {
    tabsMap = [
      {
        title: "style",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">{"CSS"}</span>
        ),
        content: (
          <Style
            key={"style"}
            storeConfiguration={style}
            updateStoreConfiguration={updateStyle}
            configurationType="style"
            variant={variant}
            theme={theme}
            integration={integration}
            view={view}
            description={`Customize the style of ${variant}. Inspect the browser console to view all selectors.`}
          />
        ),
        value: "style",
        unsavedChanges: unsavedChanges.style,
      },
    ];
    crumbs = [integration, variant];
  } else if (section === "Demo") {
    tabsMap = [
      {
        title: "desktop",
        icon: (
          <PersonalVideoIcon className="font-semibold pl-1 text-xl text-adyen" />
        ),
        content: (<CheckoutPage>
          <ManageAdvanceComponent key={run ? "run" : "default"} />
        </CheckoutPage>),
        value: "desktop",
      }, {
        title: "mobile",
        icon: (
          <PhoneIphoneIcon className="font-semibold pl-1 text-xl text-adyen" />
        ),
        content: (<CheckoutPageMobile>
          <ManageAdvanceComponent key={run ? "run" : "default"} />
        </CheckoutPageMobile>),
        value: "mobile",
      }
    ];
  }

  return (
    <div className={`${theme} border-r-2 border-border bg-dotted-grid bg-grid bg-background h-full`}>
      <React.Fragment>
        <header>
          <Topbar
            view={view}
            merchantAccount={merchantAccount}
            integration={integration}
            buildId={buildId}
          />
        </header>
        <main>
          {section === "Demo" ? (
            <div className="w-full h-full flex flex-col">
              <div className="w-[calc(100%-var(--sidebar-width))] ml-[var(--sidebar-width)] mt-[var(--topbar-width)] flex justify-center h-[calc(100vh-var(--topbar-width))] animate-slide-in-right pb-6 pt-1 px-6">
                <SandBoxTabs key={section} tabsMap={tabsMap} type="subwindow"/>
              </div>
            </div>
          ) : section ? (
            <Sandbox
              main={
                formulaLoading || merchantAccount === null ? (
                  <Loading className="text-foreground hidden" />
                ) : integration !== "sessions" && integration !== "advance" ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {"Integration type not valid"}
                    </AlertDescription>
                  </Alert>
                ) : formulaError || !formulaSuccess ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {formulaError ? formulaError : "Formula unable to load"}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <SandBoxTabs
                    key={section}
                    tabsMap={tabsMap}
                    crumbs={crumbs}
                  />
                )
              }
              topRight={
                formulaLoading || merchantAccount === null ? (
                  <Loading className="text-foreground hidden" />
                ) : integration !== "sessions" && integration !== "advance" ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {"Integration type not valid"}
                    </AlertDescription>
                  </Alert>
                ) : formulaError || !formulaSuccess ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {formulaError ? formulaError : "Formula unable to load"}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <SandBoxTabs tabsMap={topRightTabsMap} />
                )
              }
              bottomRight={
                formulaLoading || merchantAccount === null ? (
                  <Loading className="text-foreground" />
                ) : integration !== "sessions" && integration !== "advance" ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {"Integration type not valid"}
                    </AlertDescription>
                  </Alert>
                ) : formulaError || !formulaSuccess ? (
                  <Alert variant="destructive" className="w-[50%]">
                    <AlertTitle>{"Error:"}</AlertTitle>
                    <AlertDescription className="text-foreground">
                      {formulaError ? formulaError : "Formula unable to load"}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <SandBoxTabs
                    tabsMap={bottomRightTabsMap}
                    type="subwindow"
                  />
                )
              }
              view={view}
              logs={logs}
              className="pt-[var(--topbar-width)] pl-[var(--sidebar-width)]"
            />
          ) : null}
        </main>
        <footer className="h-[100%]">
          <Sidebar
            section={section}
            setSection={(section: "Client" | "Server" | "Style" | "Demo") => {
              dispatch(updateSandboxSection(section));
            }}
            unsavedChanges={unsavedChanges}
            merchantAccount={merchantAccount}
            variant={variant}
            view={view}
            integration={integration}
            logs={logs}
            theme={theme}
          />
        </footer>
      </React.Fragment>
    </div>
  );
};

export default Page;
