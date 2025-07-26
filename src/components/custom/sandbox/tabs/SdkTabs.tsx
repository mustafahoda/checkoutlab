import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Search from "@/components/custom/sandbox/editors/Search";
import VersionCompact from "@/components/custom/sandbox/editors/VersionCompact";
import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { formulaActions, specsActions } from "@/store/reducers";
import { SpecsList } from "@/store/reducers/specs";
import type { RootState } from "@/store/store";
import {
  debounce,
  prettify,
  replaceKeyValue,
  sanitizeString,
  stringifyObject,
  unstringifyObject,
} from "@/utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";

const { updateSpecs } = specsActions;
const { addUnsavedChanges, updateAdyenWebVersion, updateErrors } =
  formulaActions;

interface SdkMapValue {
  storeConfiguration: any;
  updateStoreConfiguration: any;
  configurationType: string;
  description: string;
}

interface SdkMapType {
  [key: string]: SdkMapValue;
}

interface SdkTabsProps {
  sdkMap: SdkMapType;
  theme: string;
  view: "developer" | "preview";
  integration: string;
  variant: string;
}

interface ConfigState {
  parsed: any;
  stringified: string;
  filteredProperties: Record<string, any>;
}

interface ConfigsState {
  checkoutConfiguration: ConfigState;
  txVariantConfiguration: ConfigState;
}

const formatJsString = (code: any, varName: string) => {
  return `var ${varName} = ${code};`;
};

const SdkTabs: React.FC<SdkTabsProps> = (props) => {
  const { sdkMap, theme, view, integration, variant } = props;
  const [activeTab, setActiveTab] = useState<keyof ConfigsState>(
    "checkoutConfiguration"
  );
  const [configs, setConfigs] = useState<ConfigsState>({
    checkoutConfiguration: {
      parsed: null,
      stringified: "",
      filteredProperties: {},
    },
    txVariantConfiguration: {
      parsed: null,
      stringified: "",
      filteredProperties: {},
    },
  });

  const panelRef = useRef<ImperativePanelHandle>(null);
  const dispatch = useDispatch();
  const { reset, build, adyenWebVersion, errors } = useSelector(
    (state: RootState) => state.formula
  );
  const specs = useSelector((state: RootState) => state.specs);

  // Fetch SDK specs based on active tab
  const url = `api/specs/adyen-web/v2/v${adyenWebVersion.replaceAll(".", "_")}/${
    activeTab === "checkoutConfiguration" ? "checkout" : variant
  }`;

  const {
    data: sdkSpecsData,
    loading: loadingSdkSpecData,
    error: sdkSpecsError,
  } = useApi(url, "GET", null, {
    cache: "force-cache", // Next.js will cache this response
  });

  // Update specs when data changes
  useEffect(() => {
    if (sdkSpecsData) {
      dispatch(updateSpecs({ [activeTab]: sdkSpecsData }));
      // Update filtered properties for the active tab
      setConfigs((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          filteredProperties: sdkSpecsData,
        },
      }));
    } else if (sdkSpecsError) {
      dispatch(updateSpecs({ [activeTab]: {} }));
      setConfigs((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          filteredProperties: {},
        },
      }));
    }
  }, [sdkSpecsData, sdkSpecsError, activeTab, dispatch]);

  // Update the useEffect that handles specs changes
  useEffect(() => {
    Object.keys(specs).forEach((key) => {
      if (specs[key as keyof SpecsList]) {
        const specData = specs[key as keyof SpecsList];
        // Extract schema properties from the spec data
        const schemaProps =
          specData?.components?.schemas?.[key]?.properties || specData;

        setConfigs((prev) => ({
          ...prev,
          [key]: {
            ...prev[key as keyof ConfigsState],
            filteredProperties: schemaProps,
          },
        }));
      }
    });
  }, [specs]);

  // Initialize configs
  useEffect(() => {
    Object.entries(sdkMap).forEach(async ([key, value]: [string, any]) => {
      const prettifiedString = await prettify(
        formatJsString(value.storeConfiguration, value.configurationType),
        "babel"
      );
      setConfigs((prev) => ({
        ...prev,
        [key]: {
          ...prev[key as keyof ConfigsState],
          parsed: unstringifyObject(value.storeConfiguration),
          stringified: prettifiedString,
        },
      }));
    });
  }, [reset]);

  const syncGlobalState = useCallback(
    debounce((localState: any, configType: keyof ConfigsState) => {
      const { updateStoreConfiguration } = sdkMap[configType];
      const stringifiedLocalState = stringifyObject(localState);
      const buildConfig = build[configType];

      if (
        sanitizeString(buildConfig) !== sanitizeString(stringifiedLocalState)
      ) {
        dispatch(updateStoreConfiguration(stringifiedLocalState));
        dispatch(
          addUnsavedChanges({
            js: true,
          })
        );
      } else {
        dispatch(
          addUnsavedChanges({
            js: false,
          })
        );
      }
    }, 1000),
    [build, dispatch, sdkMap]
  );

  const handleCodeChange = async (jsValue: any, stringValue: string) => {
    if (stringValue === configs[activeTab].stringified) return;

    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        parsed: jsValue,
        stringified: stringValue,
      },
    }));
    syncGlobalState(jsValue, activeTab);
  };

  const handlePrettify = async () => {
    const prettifiedString = await prettify(
      configs[activeTab].stringified,
      "babel"
    );
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        stringified: prettifiedString,
      },
    }));
  };

  const handleSearchChange = (filteredProps: Record<string, any>) => {
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        filteredProperties: filteredProps,
      },
    }));
  };

  const handleOpenSdkListChange = useCallback(
    async (value: string[], configType: keyof ConfigsState) => {
      const currentConfig = configs[configType];
      const configParameters = Object.keys(currentConfig.parsed || {});
      const isNewProperty = configParameters.length < value.length;

      if (isNewProperty) {
        const latestKey = value[value.length - 1];
        const latestValue = currentConfig.filteredProperties[latestKey];
        let newProperty = null;

        if (latestValue.type === "string") {
          newProperty = { [latestKey]: "" };
        } else if (latestValue.type === "boolean") {
          newProperty = { [latestKey]: true };
        } else if (latestValue.type === "integer") {
          newProperty = { [latestKey]: 0 };
        } else if (latestValue.type === "array") {
          newProperty = { [latestKey]: [] };
        } else if (latestValue.type === "enum") {
          newProperty = { [latestKey]: "" };
        } else if (!latestValue.type || latestValue.type === "object") {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "function") {
          newProperty = { [latestKey]: function () {} };
        }

        const newParsed = {
          ...currentConfig.parsed,
          ...newProperty,
        };

        const newStringified = await prettify(
          formatJsString(
            stringifyObject(newParsed),
            sdkMap[configType].configurationType
          ),
          "babel"
        );

        setConfigs((prev) => ({
          ...prev,
          [configType]: {
            ...prev[configType],
            parsed: newParsed,
            stringified: newStringified,
          },
        }));
        syncGlobalState(newParsed, configType);
      } else {
        // Handle property removal
        const removedProperties = configParameters.filter(
          (i) => !value.includes(i)
        );
        if (removedProperties.length > 0) {
          const updatedParsed = { ...currentConfig.parsed };
          const removedProperty = removedProperties[0];
          delete updatedParsed[removedProperty];

          const newStringified = await prettify(
            formatJsString(
              stringifyObject(updatedParsed),
              sdkMap[configType].configurationType
            ),
            "babel"
          );

          setConfigs((prev) => ({
            ...prev,
            [configType]: {
              ...prev[configType],
              parsed: updatedParsed,
              stringified: newStringified,
            },
          }));
          syncGlobalState(updatedParsed, configType);
        }
      }
    },
    [configs, sdkMap, syncGlobalState]
  );

  if ( view === "preview") {
    panelRef.current?.resize(0);
  } else if (view === "developer") {
    panelRef.current?.resize(50);
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "preview" ? 0 : 100}
        ref={panelRef}
        className={cn(
          "sm:flex bg-code flex-col items-stretch transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-1 overflow-scroll">
          <Code
            type="babel"
            code={configs[activeTab].stringified}
            readOnly={false}
            theme={theme}
            onChange={(jsValue: any, stringValue: any) => {
              if (errors.js) {
                dispatch(updateErrors({ js: false }));
              }
              handleCodeChange(jsValue, stringValue);
            }}
            jsVariable={sdkMap[activeTab].configurationType}
            handleError={(error: any) => {
              dispatch(
                updateErrors({
                  js: true,
                })
              );
            }}
          />
        </div>
        <div className={`flex justify-end border-t-2 bg-background`}>
          <Button
            key={"prettify"}
            variant="ghost"
            size="icon"
            className={`rounded-none border-l-[2px] h-[var(--custom-prettify-height)]`}
            onClick={handlePrettify}
          >
            <span className="font-semibold text-xxs text-warning">{"{ }"}</span>
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle
        className={cn(
          "transition-opacity duration-300 ease-in-out",
          view !== "developer" && "opacity-0 pointer-events-none hidden"
        )}
      />

      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 100}
        className="!overflow-y-scroll flex flex-col"
      >
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as keyof ConfigsState)
          }
          className="flex flex-col flex-grow"
        >
          <TabsList className="flex items-stretch bg-background justify-end">
            <span className="border-b-2 p-[3px] flex-1"></span>
            {Object.entries(sdkMap)
              .reverse()
              .map(([key, value], i: number) => (
                <div key={i} className={`p-[3px] border-l-2 relative`}>
                  <div
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-border transform origin-left transition-transform duration-200 ease-in-out ${
                      key !== activeTab ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <TabsTrigger
                    key={i}
                    value={key}
                    className="bg-background px-2 py-[2px] data-[state=inactive]:hover:border-info data-[state=active]:border-info"
                  >
                    <p className="p-[3px] text-xs text-foreground">
                      {value.configurationType === "checkoutConfiguration"
                        ? "checkout"
                        : variant}
                    </p>
                  </TabsTrigger>
                </div>
              ))}
          </TabsList>
          {Object.entries(sdkMap).map(([key, value]: [string, any]) => (
            <TabsContent key={key} value={key} className="flex-grow">
              {loadingSdkSpecData ? (
                <Loading className="text-foreground" />
              ) : (
                <div>
                  <Search
                    properties={specs[key as keyof SpecsList]}
                    onChange={handleSearchChange}
                    description={value.description}
                    method={"Object"}
                    label={
                      value.configurationType === "checkoutConfiguration"
                        ? "Checkout"
                        : `${variant[0].toUpperCase() + variant.slice(1)}`
                    }
                    tab={false}
                  >
                    <VersionCompact
                      label="Adyen Web"
                      value={adyenWebVersion}
                      options={
                        integration === "sessions"
                          ? WEBVERSIONS.filter((v) => /^[5-9]/.test(v))
                          : WEBVERSIONS
                      }
                      onChange={(v: any) => {
                        dispatch(updateAdyenWebVersion(v));
                        dispatch(
                          addUnsavedChanges({
                            js: adyenWebVersion !== v,
                          })
                        );
                      }}
                    />
                  </Search>
                  <OpenSdkList
                    properties={
                      specs[key as keyof SpecsList]?.components?.schemas?.[key]
                        ?.properties ||
                      configs[key as keyof ConfigsState].filteredProperties
                    }
                    selectedProperties={Object.keys(
                      configs[key as keyof ConfigsState].parsed || {}
                    )}
                    values={configs[key as keyof ConfigsState].parsed}
                    setValues={async (
                      newValue: any,
                      keyString?: string,
                      keyValue?: any,
                      type?: string
                    ) => {
                      try {
                        const newStringified = replaceKeyValue(
                          configs[key as keyof ConfigsState].stringified,
                          keyString ?? "",
                          stringifyObject(keyValue),
                          type ?? ""
                        );

                        setConfigs((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key as keyof ConfigsState],
                            parsed: newValue,
                            stringified: newStringified,
                          },
                        }));

                        syncGlobalState(newValue, key);
                      } catch (error) {
                        console.error("Error updating values:", error);
                      }
                    }}
                    onChange={(value: any) =>
                      handleOpenSdkListChange(value, key as keyof ConfigsState)
                    }
                  />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SdkTabs;
