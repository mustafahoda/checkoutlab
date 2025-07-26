"use client";

import ShareableButton from "@/components/custom/sandbox/share/ShareableButton";
import { Button } from "@/components/ui/button";
import { formulaActions, specsActions, userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { debounce } from "@/utils/utils";
import ErrorIcon from "@mui/icons-material/Error";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const DemoTopbar = (props: any) => {
    const storeFormula = useSelector((state: RootState) => state.formula);
    const { view, merchantAccount, integration, variant } = props;
    const { unsavedChanges, errors } = storeFormula;
    const dispatch = useDispatch();
    const totalUnsavedChanges = Object.values(unsavedChanges).filter(
        (value) => value
    ).length;

    const containerRef = useRef<HTMLSpanElement>(null);
    const buildButtonRef = useRef<HTMLButtonElement>(null);
    const tabErrors = Object.keys(errors).filter((key) => errors[key]);

    const storeToLocalStorage = (data: any) => {
        sessionStorage.setItem("formula", JSON.stringify(data));
    };

    useEffect(() => {
        const handleKeyDown = debounce((event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                if (buildButtonRef.current) {
                    buildButtonRef.current.click();
                }
            }
        }, 300);

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <span
            className="bg-card absolute top-0 left-[var(--sidebar-width)] h-[var(--topbar-width)] border-y-[1px] border-r-[1px] border-border stretch flex items-center justify-end px-2"
            style={{ width: `calc(100vw - var(--sidebar-width))` }}
            ref={containerRef}
        >
            <div className="flex justify-end">
                {view !== "demo" && (
                    <div className="mr-2">
                        <ShareableButton
                            disabled={totalUnsavedChanges !== 0 || tabErrors.length > 0}
                            variant={variant}
                            integration={integration}
                        />
                    </div>
                )}
                <span className="absolute top-0 right-0 z-10 transform -translate-x-1/4 -translate-y-1/4 bg-background text-xs rounded-full">
                    {Object.values(errors).filter((value) => value).length > 0 && (
                        <ErrorIcon className="text-warning !text-[16px]" />
                    )}
                </span>
                <Tooltip
                    title={`${tabErrors.length > 0 ? `Resolve ${tabErrors.join(", ")} error` : "Build (⌘ + enter)"}`}
                >
                    <span>
                        <Button
                            key="run"
                            variant="outline"
                            disabled={tabErrors.length > 0}
                            ref={buildButtonRef}
                            size="sm"
                            className="px-4 border-adyen bg-adyen text-[#fff] hover:text-adyen hover:bg-background hover:border-adyen hover:border-1"
                            onClick={() => {
                                window.location.href = "https://adyen.com/signup";
                            }}
                        >
                            Sign Up
                        </Button>
                    </span>
                </Tooltip>
            </div>
        </span>
    );
};

export default DemoTopbar;
