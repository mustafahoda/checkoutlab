import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import React from "react";
interface CssImportantProps {
  children: React.ReactNode;
  onChange: (value: any) => void;
  value: string;
}

const CssImportant = ({ children, onChange, value }: CssImportantProps) => {
  const [isImportant, setIsImportant] = useState(value?.includes("!important"));

  const handleImportantChange = (checked: boolean) => {
    setIsImportant(checked);
    if (checked) {
      // Add !important if not already present
      const newValue = value.includes("!important")
        ? value
        : value.replace(";", " !important;");
      onChange(newValue);
    } else {
      // Remove !important
      const newValue = value.replace(" !important;", ";");
      onChange(newValue);
    }
  };

  const handleChildChange = (newValue: string) => {
    if (isImportant && !newValue.includes("!important")) {
      onChange(newValue + " !important;");
    } else {
      onChange(newValue + ";");
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-2 py-2">
        <Checkbox
          id="important"
          checked={isImportant}
          onCheckedChange={handleImportantChange}
          className="border-adyen data-[state=checked]:bg-adyen data-[state=checked]:text-background"
        />
        <label
          htmlFor="important"
          className="text-xs text-foreground cursor-pointer"
        >
          !important
        </label>
      </div>
      <div>
        {React.Children.map(children, (child) =>
          React.cloneElement(child as React.ReactElement, {
            onChange: handleChildChange,
          })
        )}
      </div>
    </div>
  );
};

export default CssImportant;
