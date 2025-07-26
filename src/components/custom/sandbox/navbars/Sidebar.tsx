import { ExpandableCards } from "@/components/custom/sandbox/navbars/ExpandableCards";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestOptions } from "@/hooks/useApi";
import { formulaActions, sandboxActions, userActions } from "@/store/reducers";
import { clearUrlParams } from "@/utils/utils";
import AddCardIcon from '@mui/icons-material/AddCard';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import SettingsIcon from "@mui/icons-material/Settings";
import WebIcon from "@mui/icons-material/Web";
import Tooltip from "@mui/material/Tooltip";
import { ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import UpdateMerchantCookie from "../../adyen/account/UpdateMerchantCookie";
import Loading from "../../utils/Loading";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const { updateLogs } = userActions;
const { updateTheme } = sandboxActions;
const { clearOnDeckInfo } = formulaActions;

const Sidebar = (props: any) => {
  const {
    section,
    setSection,
    unsavedChanges,
    merchantAccount,
    variant,
    view,
    integration,
    logs,
    theme,
  } = props;
  const {
    html: htmlUnsavedChanges,
    style: styleUnsavedChanges,
    js: jsUnsavedChanges,
    checkout: checkoutUnsavedChanges,
    variant: variantUnsavedChanges,
    paymentMethods: paymentMethodsUnsavedChanges,
    payments: paymentsUnsavedChanges,
    paymentsDetails: paymentsDetailsUnsavedChanges,
    sessions: sessionsUnsavedChanges,
    events: eventsUnsavedChanges,
  } = unsavedChanges;

  const serverButtonRef = useRef<HTMLButtonElement>(null);
  const clientButtonRef = useRef<HTMLButtonElement>(null);
  const styleButtonRef = useRef<HTMLButtonElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [paymentMethods, setPaymentMethods] = useState<{
    data: any;
    loading: boolean;
    error: any;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        if (serverButtonRef.current) {
          serverButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "j") {
        event.preventDefault();
        if (clientButtonRef.current) {
          clientButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        if (styleButtonRef.current) {
          styleButtonRef.current.click();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        if (previewButtonRef.current) {
          previewButtonRef.current.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    merchantAccount && fetchPaymentMethods(merchantAccount);
  }, [merchantAccount]);

  const sideTabs: Array<SideTab> = [
    {
      name: "Server",
      hotKey: "⌘ + i",
      icon: (
        <div className="relative flex flex-col items-center justify-center ">
          <CloudQueueIcon className="!text-[20px]" />
          <p className="font-mono text-[0.6rem] flex leading-none mt-[3px]">
            APIs
          </p>
        </div>
      ),
      unsavedChanges: {
        paymentMethodsUnsavedChanges,
        paymentsUnsavedChanges,
        paymentsDetailsUnsavedChanges,
        sessionsUnsavedChanges,
      },
      ref: serverButtonRef,
    },
    {
      name: "Client",
      hotKey: "⌘ + j",
      icon: (
        <div className="relative flex flex-col items-center justify-center ">
          <WebIcon className="!text-[20px]" />
          <p className="font-mono text-[0.6rem] flex leading-none mt-[3px]">
            UI
          </p>
        </div>
      ),
      unsavedChanges: {
        checkoutUnsavedChanges,
        variantUnsavedChanges,
      },
      ref: clientButtonRef,
    },
    {
      name: "Style",
      hotKey: "⌘ + k",
      icon: (
        <div className="relative flex flex-col items-center justify-center">
          <FormatColorFillIcon className="!text-[20px]" />
          <p className="font-mono text-[0.6rem] flex leading-none mt-[3px]">
            STYLE
          </p>
        </div>
      ),
      unsavedChanges: {
        styleUnsavedChanges,
      },
      ref: styleButtonRef,
    },
  ];

  const fetchPaymentMethods = async (merchantAccount: string) => {
    try {
      const requestOptions: RequestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ merchantAccount: merchantAccount }),
      };
      const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${domain}/api/checkout/v71/paymentMethods`,
        {
          method: requestOptions.method,
          headers: requestOptions.headers,
          body: requestOptions.body,
        }
      );
      const data = await response.json();
      if (data.status >= 400) {
        throw new Error(data.message);
      } else {
        setPaymentMethods({
          data: data.paymentMethods,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      setPaymentMethods({
        data: null,
        loading: false,
        error: error.message,
      });
    }
  };

  const totalUnsavedChanges = (unsavedChanges: any) => {
    return Object.values(unsavedChanges).filter((value) => value).length;
  };
  return (
    <div ref={sidebarRef}>
      <span className="bg-card absolute top-0 left-0 w-[var(--sidebar-width)] h-[100%] border-[1px] border-border text-center">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div>
              <Drawer direction="left">
                <DrawerTrigger
                  className={`mt-4 px-2 py-[2px] inline items-center justify-center rounded-md hover:bg-foreground/10 text-foreground`}
                >
                  <div className="relative flex flex-col items-center justify-center">
                    <AddCardIcon className="!text-[20px]" />
                    <p className="font-mono text-[0.6rem] flex leading-none mt-[3px]">
                      NEW
                    </p>
                  </div>
                </DrawerTrigger>
                <DrawerPortal container={sidebarRef.current}>
                  <DrawerOverlay />
                  <DrawerContent className="h-full w-[60vw] md:w-[20vw] rounded-none border-[1px] border-border bg-card">
                    <DrawerHeader className="pb-2">
                      <DrawerTitle className="text-foreground text-md py-0">
                        <span className="flex items-center">
                          <ChevronDown className="h-4 w-4 pr-1 text-grey" />
                          <span className="display-inline px-0">
                            Formulas
                          </span>
                        </span>
                        <Link
                          href="/formulas"
                          className="text-sm ml-1 text-grey font-thin border-l-[1px] border-border pl-2"
                        >
                          Browse prebuilt integrations
                        </Link>
                      </DrawerTitle>
                      <DrawerTitle className="text-foreground text-md py-0">
                        {paymentMethods && paymentMethods.data && (
                          <span className="flex items-center">
                            <ChevronDown className="h-4 w-4 pr-1 text-grey" />
                            <span className="display-inline">
                              Online Payments
                            </span>
                          </span>
                        )}
                      </DrawerTitle>
                    </DrawerHeader>
                    {paymentMethods.loading && (
                      <div className="h-[100%] w-[100%]">
                        <Loading />
                      </div>
                    )}
                    {paymentMethods.error && (
                      <div className="h-[100%] w-[100%]">
                        <Alert variant="destructive">
                          <AlertTitle>
                            {"Error: Unable to save Payment methods"}
                          </AlertTitle>
                          <AlertDescription>
                            {paymentMethods.error}
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                    <div>
                      {paymentMethods?.data && (
                        <ExpandableCards
                          paymentMethodName={"Dropin"}
                          paymentMethodType={"dropin"}
                          defaultExpanded={variant === "dropin"}
                          defaultIntegration={integration}
                          onItemClick={() => {
                            dispatch(clearOnDeckInfo());
                          }}
                        />
                      )}
                      {paymentMethods?.data?.map((paymentMethod: any) => (
                        <ExpandableCards
                          key={paymentMethod.type}
                          paymentMethodName={paymentMethod.name}
                          paymentMethodType={paymentMethod.type}
                          defaultExpanded={variant === paymentMethod.type}
                          defaultIntegration={integration}
                          onItemClick={() => {
                            dispatch(clearOnDeckInfo());
                          }}
                        />
                      ))}
                    </div>
                  </DrawerContent>
                </DrawerPortal>
              </Drawer>
            </div>
            {sideTabs.map(
              (tab, index): any =>
                view !== "demo" && (
                  <span className="relative" key={index}>
                    <Tooltip
                      title={`${tab.name} (${tab.hotKey})`}
                      placement="right-start"
                    >
                      <Button
                        key={tab.name}
                        variant="ghost"
                        size="icon"
                        ref={tab.ref}
                        className={`mt-5 rounded-md p-5 ${section === tab.name
                          ? "!text-adyen"
                          : "hover:bg-foreground/10 !text-foreground"
                          }`}
                        onClick={() => {
                          setSection(tab.name);
                          clearUrlParams(["section", "view", "tab"]);
                        }}
                      >
                        {tab.icon}
                      </Button>
                    </Tooltip>
                    {totalUnsavedChanges(tab.unsavedChanges) !== 0 && (
                      <div className="w-4 h-4 border border-foreground rounded-full absolute -top-2 -right-2 transform bg-background text-foreground text-xxs flex items-center justify-center">
                        {totalUnsavedChanges(tab.unsavedChanges)}
                      </div>
                    )}
                  </span>
                )
            )}
            <span className="relative">
              <Tooltip
                title="Demo"
                placement="right-start"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`mt-5 rounded-md p-5 ${section === "Demo"
                    ? "bg-foreground/10 !text-adyen"
                    : "hover:bg-foreground/10 !text-foreground"
                    }`}
                  onClick={() => {
                    setSection("Demo");
                  }}
                >
                  <div className="relative flex flex-col items-center justify-center ">
                    <OndemandVideoIcon className="!text-[20px]" />
                    <p className="font-mono text-[0.6rem] flex leading-none mt-[3px]">
                      DEMO
                    </p>
                  </div>
                </Button>
              </Tooltip>
            </span>
          </div>
          <div className="pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 pt-1 rounded-md hover:bg-foreground/10 !text-foreground">
                <SettingsIcon className="!text-[20px]" />
              </DropdownMenuTrigger>
              <DropdownMenuPortal container={sidebarRef.current}>
                <DropdownMenuContent side="top" className="ml-1 rounded-lg">
                  <DropdownMenuLabel className="text-xs">
                    Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-xs rounded-none">
                      <p className="px-2">Shortcuts</p>
                      <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none">
                        <p className="px-2">Theme</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-lg">
                        <DropdownMenuItem
                          className="text-xs rounded-none text-center flex items-center justify-between"
                          onClick={() => {
                            dispatch(updateTheme("dark"));
                            localStorage.setItem("theme", "dark");
                          }}
                        >
                          <span>Dark</span>
                          {theme === "dark" && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs rounded-none text-center flex items-center justify-between"
                          onClick={() => {
                            dispatch(updateTheme("light"));
                            localStorage.setItem("theme", "light");
                          }}
                        >
                          <span>Light</span>
                          {theme === "light" && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none">
                        <p className="px-2">View</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-lg">
                        <DropdownMenuItem
                          className="text-xs rounded-none text-center flex items-center justify-between"
                          onClick={() => {
                            if (logs) {
                              dispatch(updateLogs(false));
                            } else {
                              dispatch(updateLogs(true));
                            }
                          }}
                        >
                          <span>Logs</span>
                          {logs && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-xs rounded-none">
                        <p className="px-2">Account</p>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="ml-1 rounded-lg">
                        <UpdateMerchantCookie containerRef={sidebarRef} />
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
