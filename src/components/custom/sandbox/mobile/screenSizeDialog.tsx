"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import useViewport from "@/hooks/useViewport";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

export function ScreenSizeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const viewport = useViewport();
  const containerRef = useRef(null);
  const isMobile = viewport.width && viewport.width < 768; // md breakpoint is typically 768px

  useEffect(() => {
    if (isMobile !== null && isMobile !== 0) {
      setIsOpen(isMobile);
    }
  }, [isMobile]);

  return (
    <div ref={containerRef}>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogPortal container={containerRef.current}>
          <DialogOverlay className="bg-black/85" />
          <DialogContent
            className="w-[90vw] max-w-[425px] p-7"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <Alert variant="destructive" className="text-xs text-left">
                <div className="flex items-center gap-2">
                  <ReportGmailerrorredIcon className="text-red" />
                  <AlertTitle>
                    Sandbox and code editor features require a larger screen.
                  </AlertTitle>
                </div>
                <AlertDescription className="text-left text-xs text-foreground pt-2">
                  Please use a device with a larger screen (tablet or desktop)
                  to access this site.
                </AlertDescription>
              </Alert>
            </DialogHeader>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
