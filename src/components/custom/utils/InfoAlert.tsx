"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoIcon from "@mui/icons-material/Info";

const InfoAlert = ({ message }: { message: string }) => {
  return (
    <div className="h-[100%] w-[100%] max-w-[40vw]">
      <Alert variant="default" className="flex py-[8px] px-[3px] rounded-[4px]">
        <div className="flex items-center pl-2">
          <InfoIcon className="text-info text-[1.2rem]" />
          <AlertDescription className="text-[.72rem] pl-1 text-grey">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default InfoAlert;
