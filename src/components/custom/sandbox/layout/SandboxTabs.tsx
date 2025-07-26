import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import React, { useEffect, useRef, useState } from "react";
import { TabsProps } from "./types";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { sandboxActions } from "@/store/reducers";
import { clearUrlParams } from "@/utils/utils";

const { updateTab } = sandboxActions;

const SandboxTabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { tabsMap, crumbs, onExpand, onContract, type, className } = props;
  const dispatch = useDispatch();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hasExpanded, setHasExpanded] = useState(false);
  const { tab } = useSelector((state: RootState) => state.sandbox);
  const tabTitle = tab ? tab : tabsMap[0].value;

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (tabsMap.length > 1) {
        if (event.shiftKey && event.key === "ArrowRight") {
          event.preventDefault();
          const currentIndex = tabsMap.findIndex(
            (tab) => tab.value === tabTitle
          );
          const nextIndex = (currentIndex + 1) % tabsMap.length;
          dispatch(updateTab(tabsMap[nextIndex].value));
          tabRefs.current[nextIndex]?.focus();
        } else if (event.shiftKey && event.key === "ArrowLeft") {
          event.preventDefault();
          const currentIndex = tabsMap.findIndex(
            (tab) => tab.value === tabTitle
          );
          const prevIndex =
            (currentIndex - 1 + tabsMap.length) % tabsMap.length;
          dispatch(updateTab(tabsMap[prevIndex].value));
          tabRefs.current[prevIndex]?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabTitle, tabsMap]);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <Tabs
        value={tabsMap.find((t) => t.value === tab)?.value || tabsMap[0].value}
        className="w-full h-full flex flex-col"
        onValueChange={(value) => {
          dispatch(updateTab(value));
          clearUrlParams(["tab", "section", "view"]);
        }}
      >
        <span className="flex justify-between mb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-[45px] h-auto">
          <TabsList className="mt-3">
            {tabsMap.map((tab, index) => (
              <div key={index} className="p-[3px]">
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className={`flex px-2 py-[2px] justify-space-between`}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                >
                  <span>{tab.icon}</span>
                  <p className="px-1 text-xs">{tab.title}</p>
                  {tab.unsavedChanges && (
                    <span className="ml-1 w-2 h-2 rounded-full inline-block bg-adyen"></span>
                  )}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
          {!hasExpanded && type !== "subwindow" && (
            <div className="hidden md:flex items-center bg-[hsl(var(--accent))] border-[1px] border-border p-1 mt-3 rounded-md">
              <Button
                key="clear"
                variant="outline"
                size="sm"
                className="shadow-none w-5 h-6 bg-card border-none"
                onClick={(e) => {
                  if (onExpand) {
                    onExpand();
                    setHasExpanded(!hasExpanded);
                  }
                }}
              >
                <OpenInFullIcon className="text-primary !text-xs" />
              </Button></div>
          )}
          {hasExpanded && type !== "subwindow" && (
            <div className="hidden md:flex items-center bg-[hsl(var(--accent))] border-[1px] border-border p-1 mt-3 rounded-md">
              <Button
                key="clear"
                variant="outline"
                size="sm"
                className="shadow-none w-5 h-6 bg-card border-none"
                onClick={(e) => {
                  if (onContract) {
                    onContract();
                    setHasExpanded(!hasExpanded);
                  }
                }}
              >
                <CloseFullscreenIcon className="text-primary !text-xs" />
              </Button></div>
          )}
        </span>
        {tabsMap.map((tab, index) => (
          <TabsContent
            key={index}
            value={tab.value}
            className="w-full flex-grow overflow-y-scroll rounded-md"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SandboxTabs;
