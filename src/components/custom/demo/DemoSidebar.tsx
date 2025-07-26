import { Button } from "@/components/ui/button";
import { RequestOptions } from "@/hooks/useApi";
import { formulaActions, sandboxActions, userActions } from "@/store/reducers";
import BrushIcon from "@mui/icons-material/Brush";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import WebIcon from "@mui/icons-material/Web";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface SideTab {
  name: string;
  icon: JSX.Element;
  unsavedChanges: any;
  hotKey: string;
  ref: any;
}

const { updateTheme, updateView} = sandboxActions;
const { clearOnDeckInfo } = formulaActions;

const Sidebar = (props: any) => {
  const {
    section,
    sections,
    setSection,
    unsavedChanges,
    merchantAccount,
    variant,
  } = props;
  const {
    style: styleUnsavedChanges,
    checkout: checkoutUnsavedChanges,
    variant: variantUnsavedChanges,
    paymentMethods: paymentMethodsUnsavedChanges,
    payments: paymentsUnsavedChanges,
    paymentsDetails: paymentsDetailsUnsavedChanges,
    sessions: sessionsUnsavedChanges,
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
          <BrushIcon className="!text-[20px]" />
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

  return (
    <div ref={sidebarRef}>
      <span className="bg-card absolute top-0 left-0 w-[var(--sidebar-width)] h-[100%] border-[1px] border-border text-center">
        <div className="flex flex-col justify-between h-full">
          <div>
            {sideTabs.map(
              (tab, index): any =>
                sections.includes(tab.name) && (
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
                          ? "bg-foreground/10 !text-adyen"
                          : "hover:bg-foreground/10 !text-foreground"
                          }`}
                        onClick={() => setSection(tab.name)}
                      >
                        {tab.icon}
                      </Button>
                    </Tooltip>
                  </span>
                )
            )}
          </div>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
