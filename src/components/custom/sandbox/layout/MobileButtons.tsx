// Mobile Buttons
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MobileNextButtons = ({ onBack, onNext }: { onBack: any, onNext: any }) => {
    const [preview, setPreview] = useState(false);
    return (
        <div className="md:hidden fixed bottom-10 left-[40%] z-50 flex justify-between px-3">
            {!preview && (
                <Button
                    key="clear"
                    variant="default"
                    size="sm"
                    className="bg-adyen rounded-full text-[hsl(var(--white))] hover:text-adyen text-lg font-semibold p-5"
                    onClick={() => {
                        onBack();
                        setPreview(true);
                    }}
                >
                    {"Preview"}
                </Button>
            )}
            {preview && (<Button
                key="clear"
                variant="default"
                size="sm"
                className="bg-adyen rounded-full text-[hsl(var(--white))] hover:text-adyen text-lg font-semibold p-5"
                onClick={() => {
                    onNext();
                    setPreview(false);
                }}
            >
                {"Parameters"}
            </Button>)}
        </div>
    )
}

export default MobileNextButtons;