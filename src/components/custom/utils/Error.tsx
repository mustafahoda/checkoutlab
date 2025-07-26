"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface AdyenError {
  errorCode?: string;
  errorType?: string;
  status?: string;
  message?: string;
}

const Error = ({ error }: { error: AdyenError }) => {
  return (
    <div className="h-[100%] w-[100%] py-2">
      <Alert variant="default" className="border-primary px-3 flex">
        <div className="flex items-center">
          <ErrorOutlineIcon className="text-warning" />
        </div>
        <div className="flex-1 flex flex-col pl-1">
          <AlertTitle>{"Error"}</AlertTitle>
          {error?.errorCode && (
            <AlertDescription className="text-xs">{`Code: ${error.errorCode}`}</AlertDescription>
          )}
          {error?.errorType && (
            <AlertDescription className="text-xs">{`Type: ${error.errorType}`}</AlertDescription>
          )}
          {error?.status && (
            <AlertDescription className="text-xs">{`Status: ${error.status}`}</AlertDescription>
          )}
          {error?.message && (
            <AlertDescription className="text-xs">{`Message: ${error.message}`}</AlertDescription>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default Error;
