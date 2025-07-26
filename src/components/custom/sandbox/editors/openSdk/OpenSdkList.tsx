import Array from "@/components/custom/sandbox/editors/Array";
import Enum from "@/components/custom/sandbox/editors/Enum";
import { String } from "@/components/custom/sandbox/editors/String";
import InfoAlert from "@/components/custom/utils/InfoAlert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Use the global Array.isArray instead
const isValidArray = (value: unknown): boolean => {
  // Use the global Array object instead of the imported component
  return (
    globalThis.Array.isArray(value) || value === undefined || value === null
  );
};

export const OpenSdkList = ({
  selectedProperties,
  properties,
  values,
  setValues,
  onChange,
}: {
  selectedProperties?: string[];
  properties: any;
  values: any;
  setValues: (values: any, property: string, value: any, type: string) => void;
  onChange?: (value: string[]) => void;
}) => {
  // Sort property keys alphabetically
  const propertyKeys = properties
    ? Object.keys(properties).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      )
    : [];

  return (
    <Accordion
      type="multiple"
      className="w-full px-3"
      value={selectedProperties}
      onValueChange={onChange}
    >
      {propertyKeys.length === 0 && (
      <div className="p-3">
          <p className="text-sm text-foreground">{`0 matching results`}</p>
        </div>
      )}
      {propertyKeys.length > 0 &&
        propertyKeys.map((property: any) => (
          <AccordionItem
            key={property}
            value={property}
            className="hover:no-underline border-[1px] border-border rounded-md my-2"
          >
          <AccordionTrigger className="px-4 py-3 hover:bg-muted flex flex-col">
            <div className="flex justify-start w-full items-center mb-2">
                <p className="text-[0.85rem] text-foreground">{property}</p>
                <p className="font-mono text-xs flex-grow text-left">
                  {properties[property].type && (
                    <span className="pl-2 text-grey">
                      {properties[property].type}
                    </span>
                  )}
                  {properties[property]?.required && (
                    <span className="pl-2 text-warning">Required</span>
                  )}
                </p>
              </div>
              {properties[property]?.description && (
                <p className="w-full text-xs pb-2 text-grey text-left no-underline">
                  {properties[property].description}
                </p>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 pr-4">
                {properties[property].type === "object" &&
                  Object.keys(properties[property]?.additionalProperties || {})
                    .length > 0 && (
                    <div className="border-l-[1px]">
                      <OpenSdkList
                        properties={properties[property].additionalProperties}
                        values={values[property] || {}}
                        setValues={(newValues, prop, value, type) => {
                          const updatedNestedValues = {
                            ...(values[property] || {}),
                            [prop]: value,
                          };
                          setValues(
                            { ...values, [property]: updatedNestedValues },
                            property,
                            updatedNestedValues,
                            "object"
                          );
                        }}
                        selectedProperties={Object.keys(values[property] || {})}
                        onChange={(value: any) => {
                          const currentProperties = Object.keys(
                            values[property] || {}
                          );
                          const isNewProperty =
                            currentProperties.length < value.length;
                          let newProperty = null;

                          if (isNewProperty) {
                            // Handle adding new property
                            const latestKey = value[value.length - 1];
                            const latestValue =
                              properties[property].additionalProperties[
                                latestKey
                              ];
                            if (latestValue.type === "string") {
                              newProperty = { [latestKey]: "" };
                            } else if (latestValue.type === "boolean") {
                              newProperty = { [latestKey]: true };
                            } else if (latestValue.type === "integer") {
                              newProperty = { [latestKey]: 0 };
                            } else if (latestValue.type === "number") {
                              newProperty = { [latestKey]: 0 };
                            } else if (latestValue.type === "array") {
                              newProperty = { [latestKey]: [] };
                            } else if (latestValue.type === "enum") {
                              newProperty = { [latestKey]: "" };
                            } else if (
                              !latestValue.type ||
                              latestValue.type === "object"
                            ) {
                              newProperty = { [latestKey]: {} };
                            } else if (latestValue.type === "function") {
                              newProperty = { [latestKey]: function () {} };
                            }

                            setValues(
                              {
                                ...values,
                                [property]: {
                                  ...values[property],
                                  ...newProperty,
                                },
                              },
                              property,
                              {
                                ...values[property],
                                ...newProperty,
                              },
                              "object"
                            );
                          } else {
                            // Handle property removal
                            const removedProperties = currentProperties.filter(
                              (i) => !value.includes(i)
                            );

                            if (removedProperties.length > 0) {
                              const updatedNestedValues = {
                                ...values[property],
                              };
                              const removedProperty = removedProperties[0];
                              delete updatedNestedValues[removedProperty];

                              setValues(
                                { ...values, [property]: updatedNestedValues },
                                property,
                                updatedNestedValues,
                                "object"
                              );
                            }
                          }
                        }}
                      />
                    </div>
                  )}

                {properties[property].type === "string" && (
                  <String
                    value={values[property] ? values[property] : ""}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : "";
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "string"
                      );
                    }}
                  />
                )}

                {properties[property].type === "enum" && (
                  <Enum
                    value={
                      values[property] !== undefined ? values[property] : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : "";
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "string"
                      );
                    }}
                    set={properties[property].values.map((value: any) => {
                      return value.replace(/'/g, "");
                    })}
                  />
                )}

                {properties[property].type === "integer" ||
                  (properties[property].type === "number" && (
                    <String
                      value={values[property] ? values[property] : 0}
                      onChange={(value: any) => {
                        let tidyValue =
                          value !== undefined ? parseInt(value) : 0;
                        setValues(
                          { ...values, [property]: tidyValue },
                          property,
                          tidyValue,
                          "integer"
                        );
                      }}
                    />
                  ))}
                {properties[property].type === "boolean" && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].toString()
                        : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value === "true" ? true : false;
                      setValues(
                        { ...values, [property]: tidyValue },
                        property,
                        tidyValue,
                        "boolean"
                      );
                    }}
                    set={["true", "false"]}
                  />
                )}
                {properties[property].type === "array" &&
                  isValidArray(values[property]) && (
                    <Array
                      value={values[property] ? values[property] : []}
                      onChange={(value: any) => {
                        let tidyValue = value !== undefined ? value : [];
                        setValues(
                          { ...values, [property]: tidyValue },
                          property,
                          tidyValue,
                          "array"
                        );
                      }}
                    />
                  )}
                {properties[property].type === "function" && (
                  <InfoAlert message="Update functions in developer mode under settings > view > developer" />
                )}
                {property === "paymentMethodsResponse" && (
                  <InfoAlert message="This parameter gets automatically updated with the /paymentMethods response" />
                )}
                {property === "session" && (
                  <InfoAlert message="This parameter gets automatically updated with the /paymentMethods response" />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
