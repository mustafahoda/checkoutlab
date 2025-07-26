import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RootState } from "@/store/store";
import { refineFormula } from "@/utils/utils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { bookmarkletCode } from "@/utils/bookmarklet";
import { Checkbox } from "@/components/ui/checkbox";

const ShareableButton = (props: any) => {
  const { section, view, tab: sandboxTab, buildId } = props;
  const [showCheck, setShowCheck] = useState(false);
  const [tab, setTab] = useState("share");
  const { disabled } = props;
  const { variant, integration } = useParams<{
    variant: string;
    integration: string;
  }>();
  const state = useSelector((state: RootState) => state.formula);
  const { merchantAccount } = useSelector((state: RootState) => state.user);
  const containerRef = useRef(null);
  const [formula, setFormula] = useState<any>({
    data: null,
    loading: false,
    error: null,
  });
  const [sharedBuildId, setSharedBuildId] = useState(null);

  const { data, loading, error } = formula;
  const handleShare = (request: any) => {
    const processedRequest = refineFormula(request);
    const requestBody = JSON.stringify({
      configuration: processedRequest,
      txVariant: variant,
      integrationType: integration,
      public: false,
    });

    setFormula({ ...formula, loading: true });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formula/${integration}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((response) => {
        const { data } = response;
        setFormula({ data, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error:", error);
        setFormula({ data: null, loading: false, error });
      });
  };

  const handleCopy = async () => {
    try {
      const url =
        tab === "embed"
          ? `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}/embed?id=${data._id}&merchantAccount=${merchantAccount}`
          : `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}?id=${data._id}&view=${view}&section=${section}${sandboxTab ? `&tab=${sandboxTab}` : ""}`;
      await navigator.clipboard.writeText(url);
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Create bookmarklet URL
  const createBookmarkletUrl = () => {
    const encodedCode = encodeURIComponent(bookmarkletCode);
    return `javascript:${encodedCode}`;
  };

  return (
    <div ref={containerRef}>
      <Dialog
        onOpenChange={(open) => {
          if (open && sharedBuildId !== buildId) {
            handleShare(state);
            setSharedBuildId(buildId);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            key="clear"
            variant="outline"
            disabled={disabled}
            size="sm"
            className="px-2 bg-card border-adyen text-foreground hover:text-adyen hover:bg-background hover:border-adyen hover:border-1"
          >
            share
          </Button>
        </DialogTrigger>
        <DialogPortal container={containerRef.current}>
          <DialogOverlay />
          <DialogContent className="p-5 sm:max-w-[425px] flex flex-col text-foreground">
            <DialogHeader>
              <DialogTitle className="text-[16px] text-foreground">
                {tab === "share"
                  ? "Share "
                  : "Embed "}
                your build
              </DialogTitle>
              <DialogDescription className="text-[13px]">
                {`You can ${tab === "share"
                  ? "share"
                  : "embed"
                  } your build by copying the link below`}
              </DialogDescription>
              <DialogDescription className="text-[13px]">
                {`ID: ${data ? data._id : "loading..."}`}
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="text-red-500 text-xs mb-2">{error}</div>
            )}
            {loading && <Loading />}
            {data && !loading && !error && (
              <div className="flex items-center justify-start border-b border-border">
                <Button
                  className={`h-[1.5rem] shadow-none border-l-0 border-r-0 border-t-0 ${tab === "share" ? "border-b-2" : "border-b-0"} border-adyen rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden`}
                  onClick={() => setTab("share")}
                  key="share"
                  variant="outline"
                  size="sm"
                >
                  <span className="text-foreground text-xs">share</span>
                </Button>
                <Button
                  className={`h-[1.5rem] shadow-none border-l-0 border-r-0 border-t-0 ${tab === "embed" ? "border-b-2" : "border-b-0"} border-adyen rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden`}
                  onClick={() => setTab("embed")}
                  key="embed"
                  variant="outline"
                  size="sm"
                >
                  <span className="text-foreground text-xs">embed</span>
                </Button>
              </div>
            )}
            {data && !loading && !error && (
              <div className="flex items-stretch">
                <div className="border-border border border-r-none rounded rounded-r-none">
                  <p className="!h-[100%] max-w-[350px] flex items-center justify-center flex-1 text-xs px-1 py-0 text-foreground whitespace-nowrap overflow-scroll">
                    {view !== "embed"
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}?id=${data._id}&view=${view}`
                      : `${process.env.NEXT_PUBLIC_API_URL}/${integration}/${variant}/embed?id=${data._id}`}
                  </p>
                </div>
                <div className="justify-start">
                  <Button
                    className="h-[100%] py-4 text-xs text-background w-10 rounded-tl-none rounded-bl-none rounded-br-2 rounded-tr-2 relative overflow-hidden border-border"
                    onClick={handleCopy}
                    key="reset"
                    variant="outline"
                    size="sm"
                  >
                    <div className="absolute inset-0">
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out",
                          showCheck
                            ? "transform -translate-y-full"
                            : "transform translate-y-0"
                        )}
                      >
                        <ContentCopyIcon className="!text-foreground !text-[16px]" />
                      </div>
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-in-out",
                          showCheck
                            ? "transform translate-y-0"
                            : "transform translate-y-full"
                        )}
                      >
                        <CheckIcon className="!text-foreground !text-[16px]" />
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
            {tab === "embed" && (
              <div className="pb-1 text-[13px]">
                <div className="pb-1">
                  <DialogDescription className="inline-block text-foreground">Step 1: </DialogDescription>{" "}
                  <DialogDescription className="inline-block">
                    {` Save the `}
                    <a
                      href={createBookmarkletUrl()}
                      className="text-info"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Drag this link to your bookmarks bar");
                      }}
                    >
                      checkoutLab
                    </a>{" "}
                    bookmarklet to your browser.
                  </DialogDescription>
                </div>
                <div className="pb-1">
                  <DialogDescription className="inline-block text-foreground">Step 2:</DialogDescription>{" "}
                  <DialogDescription className="inline-block">
                    Navigate to any checkout page
                  </DialogDescription>
                </div>
                <div className="pb-1">
                  <DialogDescription className="inline-block text-foreground">Step 3:</DialogDescription>{" "}
                  <DialogDescription className="inline-block">Click the bookmarklet</DialogDescription>
                </div>
                <div className="pb-1">
                  <DialogDescription className="inline-block text-foreground">Step 4:</DialogDescription>{" "}
                  <DialogDescription className="inline-block">
                    Enter the above url and embed your build
                  </DialogDescription>
                </div></div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default ShareableButton;
