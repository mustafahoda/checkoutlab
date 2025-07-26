import { Button } from "@/components/ui/button";
import Tooltip from "@mui/material/Tooltip";
import { Logo } from "../../utils/Logo";

const DemoTopbar = (props: any) => {

    return (
        <span
            className="bg-card fixed top-0 left-0 right-0 z-50 h-[var(--topbar-width)] border-b-[1px] border-x-[1px] border-border flex items-center justify-end px-2 w-full"
        >
            <div className="flex justify-between w-full">
                <div className="flex items-center px-4">
                    <Logo />
                </div>
                <div className="flex justify-end">
                    <Tooltip title="Documentation">
                        <a
                            href="https://github.com/i-am-hernan/payment-sandbox/blob/main/readme.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                key="run"
                                variant="outline"
                                size="sm"
                                className="px-4 border-adyen bg-adyen text-[#fff] hover:text-adyen hover:bg-background hover:border-adyen hover:border-1"
                            >
                                Documentation
                            </Button>
                        </a>
                    </Tooltip></div>
            </div>
        </span>
    );
};

export default DemoTopbar;
