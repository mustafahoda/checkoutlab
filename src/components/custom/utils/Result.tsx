"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";

interface AdyenResult {
  resultCode: string;
  pspReference: string;
  refusalReason?: string;
}

const Result = ({ adyenResult }: { adyenResult: AdyenResult }) => {
  const { resultCode, pspReference, refusalReason } = adyenResult;
  return (
    <div className="h-[100%] w-[100%] py-1">
      <Alert variant="default" className="border-border flex items-center bg-card">
        <div className="flex items-center">
          {resultCode === "Authorised" ? (
            <CheckCircleOutlineIcon className="text-adyen" />
          ) : resultCode === "Refused" ? (
            <ErrorOutlineIcon className="text-warning" />
          ) : (
            <PendingIcon className="text-adyen" />
          )}
        </div>
        <div className="flex-1 flex flex-col pl-2">
          <AlertTitle>{resultCode}</AlertTitle>
          {pspReference && <AlertDescription className="text-xs">{`PSP Reference: ${pspReference}`}</AlertDescription>}
          {resultCode === "Refused" && refusalReason && (
            <AlertDescription className="text-xs">{`Reason: ${refusalReason}`}</AlertDescription>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default Result;
