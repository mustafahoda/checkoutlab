"use client";

import { ManageAdvanceComponent } from "@/components/custom/adyen/advanced/ManageAdvanceComponent";
import CheckoutPage from "@/components/custom/checkout/CheckoutPage";
import Sandbox from "@/components/custom/sandbox/layout/Sandbox";
import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import { ScreenSizeDialog } from "@/components/custom/sandbox/mobile/screenSizeDialog";
import DemoSidebar from "@/components/custom/demo/DemoSidebar";
import DemoTopbar from "@/components/custom/demo/DemoToolbar";
import Features from "@/components/custom/demo/Features";
import Style from "@/components/custom/sandbox/tabs/Style";
import Loading from "@/components/custom/utils/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormula } from "@/hooks/useFormula";
import useMerchantInCookie from "@/hooks/useMerchantInCookie";
import { useView } from "@/hooks/useView";
import { formulaActions, userActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutPageMobile from "@/components/custom/checkout/CheckoutPageMobile";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import HomeTopBar from "@/components/custom/sandbox/navbars/HomeTopBar";

interface SectionType {
  section: "Client" | "Style";
}

const {
  updateCheckoutConfiguration,
  updateTxVariantConfiguration,
  updateStyle,
  updateApiRequestMerchantAccount,
  updateBuildMerchantAccount,
  updateReset,
} = formulaActions;

const { updateMerchantAccount } = userActions;
const integration: string = "advance";
const variant: string = "dropin";

const Page: any = () => {
  const [section, setSection] = useState<SectionType["section"]>("Client");
  const { theme, defaultMerchantAccount, merchantAccount, view, logs } = useSelector(
    (state: RootState) => state.user
  );

  const { formulaLoading, formulaError, formulaSuccess } = useFormula(
    variant,
    view,
    integration,
    null
  );

  const {
    run,
    unsavedChanges,
    checkoutConfiguration,
    txVariantConfiguration,
  } = useSelector((state: RootState) => state.formula);

  const dispatch = useDispatch();

  useMerchantInCookie(defaultMerchantAccount, (merchantAccount: string) => {
    dispatch(updateApiRequestMerchantAccount(merchantAccount));
    dispatch(updateBuildMerchantAccount(merchantAccount));
    dispatch(updateMerchantAccount(merchantAccount));
    dispatch(updateReset());
  });

  console.log("merchantAccount", merchantAccount)
  console.log("formulaLoading", formulaLoading)
  console.log("formulaError", formulaError)
  console.log("formulaSuccess", formulaSuccess)
  console.log("formulaLoading || merchantAccount === null", formulaLoading || merchantAccount === null)
  let tabsMap: any = [];
  let topRightTabsMap = [
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
  if (section === "Client") {
    tabsMap = [
      {
        title: "checkout",
        icon: (
          <span className="font-semibold px-1 text-xxs text-info">{"FEATURES"}</span>
        ),
        content: (
          <Features
            checkoutConfiguration={checkoutConfiguration}
            updateCheckoutConfiguration={updateCheckoutConfiguration}
            txVariantConfiguration={txVariantConfiguration}
            updateTxVariantConfiguration={updateTxVariantConfiguration}
            variant={variant}
            theme={theme}
            integration={integration}
            view={"preview"}
            description="Create a configuration object for Checkout"
          />
        ),
        value: `checkout`,
        unsavedChanges: unsavedChanges.checkout,
      }
    ];
  }

  return (
    <div className={`${theme} border-r-2 border-border bg-dotted-grid bg-grid bg-background`}>
      <React.Fragment>
        <header>
          <HomeTopBar />
        </header>
        <main>
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
                <SandBoxTabs key={section} tabsMap={tabsMap} />
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
            view={"feature"}
            logs={logs}
            className="pt-[var(--topbar-width)]"
          />
        </main>
      </React.Fragment>
    </div>
  );
};

export default Page;
