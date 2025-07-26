"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import useViewport from "@/hooks/useViewport";
import MobileNextButtons from "./MobileButtons";


interface SandboxContentProps {
  main: any;
  topRight: any;
  bottomRight?: any;
  view: "developer" | "preview" | "feature";
  logs: boolean;
  className?: string;
  isMobile?: boolean;
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
  view,
  logs,
  className,
}: SandboxContentProps) => {
  const refA = useRef<ImperativePanelHandle>(null);
  const refB = useRef<ImperativePanelHandle>(null);
  const viewport = useViewport();
  const isMobile = !!(viewport.width && viewport.width < 768 && viewport.width > 0);

  useEffect(() => {
    if (isMobile) {
      refA.current?.resize(100);
    } else if (view === "preview") {
      refA.current?.resize(50);
    } else if (view === "developer") {
      refA.current?.resize(60);
    } else if (view === "feature") {
      refA.current?.resize(30);
    }
  }, [view, isMobile]);

  useEffect(() => {
    if (logs) {
      refB.current?.resize(50);
    } else {
      refB.current?.resize(0);
    }
  }, [logs]);

  const handleMainExpand = () => {
    refA.current?.resize(100);
  };

  const handleTopRightExpand = () => {
    refA.current?.resize(0);
    refB.current?.resize(0);
  };

  const handleBottomRightExpand = () => {
    refB.current?.resize(50);
  };

  const handleBottomRightContract = () => {
    refB.current?.resize(7);
  };

  const handleContract = () => {

    if (view === "preview") {
      refA.current?.resize(50);
    } else if (view === "developer") {
      refA.current?.resize(60);
    } else if (view === "feature") {
      refA.current?.resize(30);
    }
    refB.current?.resize(0);
  };

  const handleMainRightExpand = () => {
    refA.current?.resize(100);
  };

  const handleMainLeftExpand = () => {
    refA.current?.resize(0);
  };



  return (
    <div className="relative">
      <MobileNextButtons onBack={handleMainLeftExpand} onNext={handleMainRightExpand} />
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "!h-screen inline-block",
          className
        )}
      >
        <ResizablePanel
          defaultSize={view === "developer" ? 60 : view === "preview" ? 30 : 0}
          ref={refA}
          maxSize={100}
          className={cn(
            "transition-all duration-300 ease-in-out",
          )}
        >
          <div className="items-center justify-center flex w-full h-full animate-slide-in pl-6 pr-0 md:pr-3 pt-1 pb-3">
            {React.cloneElement(Main, {
              onExpand: handleMainExpand,
              onContract: handleContract,
            })}
          </div>
        </ResizablePanel>
        <ResizableHandle
          className={cn(
            "border-none bg-transparent"
          )}
        />
        <ResizablePanel
          defaultSize={isMobile ? 100 : view === "developer" ? 40 : view === "preview" ? 70 : 100}
          className="transition-all duration-300 ease-in-out pl-6 md:pl-3 pr-0 md:pr-3 pt-1 pb-3"
        >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={100}
              className="transition-all duration-300 ease-in-out"
            >
              <div className="items-center justify-center flex w-full h-full animate-slide-in-right">
                {React.cloneElement(TopRight, {
                  onExpand: handleTopRightExpand,
                  onContract: handleContract,
                })}
              </div>
            </ResizablePanel>
            <ResizableHandle
              className={cn(
                view !== "developer" && "opacity-0 pointer-events-none hidden"
              )}
            />
            <ResizablePanel
              defaultSize={0}
              maxSize={50}
              ref={refB}
              className={cn("transition-all duration-300 ease-in-out")}
            >
              <div className="items-center justify-center flex w-full h-full">
                {BottomRight && React.cloneElement(BottomRight, {
                  onExpand: handleBottomRightExpand,
                  onContract: handleBottomRightContract,
                })}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup></div>
  );
};

export default Sandbox;
//bg-dotted-grid bg-grid bg-background