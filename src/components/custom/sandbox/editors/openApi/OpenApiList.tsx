import Enum from "@/components/custom/sandbox/editors/Enum";
import { String } from "@/components/custom/sandbox/editors/String";
import Array from "@/components/custom/sandbox/editors/Array";
import { parseStringWithLinks } from "@/components/custom/utils/Utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { resolveRef } from "@/utils/utils";
import { useState } from "react";

const OpenApiList = (props: any) => {
  const {
    openApi,
    properties,
    selectedProperties,
    values,
    setValues,
    onChange,
    required,
  } = props;

  const [additionalPropertiesPath, setAdditionalPropertiesPath] = useState<
    string | null
  >(null);

  const propertyKeys = properties ? Object.keys(properties) : [];

  const createOpenApiList = (path: string, property: string) => {
    return (
      <div className="border-l-[1px]">
        <OpenApiList
          openApi={openApi}
          properties={resolveRef(openApi, path)?.properties || {}}
          required={resolveRef(openApi, path)?.required || []}
          selectedProperties={
            values && values[property] ? Object.keys(values[property]) : []
          }
          values={values[property] || {}}
          setValues={(value: any) => {
            setValues({ ...values, [property]: value });
          }}
          onChange={(value: any) => {
            const requestParameters =
              values && values[property] ? Object.keys(values[property]) : [];
            const isNewProperty = requestParameters.length < value.length;

            if (isNewProperty) {
              const latestKey = value[value.length - 1];
              const latestValue = resolveRef(openApi, path).properties[
                latestKey
              ];

              let newProperty = null;
              if (latestValue.type === "string") {
                newProperty = { [latestKey]: "" };
              } else if (latestValue.type === "boolean") {
                newProperty = { [latestKey]: true };
              } else if (latestValue.type === "integer") {
                newProperty = { [latestKey]: 0 };
              } else if (latestValue.type === "array") {
                newProperty = { [latestKey]: [] };
              } else if (!latestValue.type || latestValue.type === "object") {
                newProperty = { [latestKey]: {} };
              }

              setValues({
                ...values,
                [property]: {
                  ...(values[property] || {}),
                  ...newProperty,
                },
              });
            } else {
              const removedProperties = requestParameters.filter(
                (i) => !value.includes(i)
              );
              if (removedProperties.length > 0) {
                const updatedNestedValues = { ...values[property] };
                delete updatedNestedValues[removedProperties[0]];
                setValues({
                  ...values,
                  [property]: updatedNestedValues,
                });
              }
            }
          }}
        />
      </div>
    );
  };

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
                  {!properties[property].type && (
                    <span className="pl-2 text-grey">{"object"}</span>
                  )}
                  {required?.indexOf(property) > -1 && (
                    <span className="pl-2 text-warning">Required</span>
                  )}
                </p>
              </div>
              {properties[property]?.description && (
                <p className="w-full text-xs pb-2 text-grey text-left no-underline">
                  {parseStringWithLinks(properties[property].description)}
                </p>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t-none">
              <div className="pl-6 pr-4">
                {properties[property].type === "string" &&
                  !properties[property].enum && (
                    <String
                      value={values[property] ? values[property] : ""}
                      onChange={(value: any) => {
                        let tidyValue = value !== undefined ? value : "";
                        setValues({ ...values, [property]: tidyValue });
                      }}
                    />
                  )}
                {properties[property].type === "string" &&
                  properties[property].enum && (
                    <Enum
                      value={
                        values[property] !== undefined ? values[property] : ""
                      }
                      onChange={(value: any) => {
                        let tidyValue = value !== undefined ? value : "";
                        setValues({ ...values, [property]: tidyValue });
                      }}
                      set={properties[property].enum}
                    />
                  )}
                {properties[property].type === "integer" && (
                  <String
                    value={values[property] ? values[property] : 0}
                    onChange={(value: any) => {
                      let tidyValue =
                        value !== undefined || value !== null
                          ? parseInt(value)
                          : 0;
                      setValues({ ...values, [property]: tidyValue });
                    }}
                  />
                )}
                {properties[property].type === "boolean" && (
                  <Enum
                    value={
                      values[property] !== undefined
                        ? values[property].toString()
                        : ""
                    }
                    onChange={(value: any) => {
                      let tidyValue = value === "true";
                      setValues({ ...values, [property]: tidyValue });
                    }}
                    set={["true", "false"]}
                  />
                )}
                {properties[property].type === "array" && (
                  <Array
                    value={values[property] || []}
                    onChange={(value: any) => {
                      let tidyValue = value !== undefined ? value : [];
                      setValues({ ...values, [property]: tidyValue });
                    }}
                  />
                )}
                {properties[property]["x-anyOf"]?.length > 0 && (
                  <div>
                    <Enum
                      value={
                        additionalPropertiesPath?.split("/").pop() ||
                        properties[property]["x-anyOf"][0]["$ref"]
                          .split("/")
                          .pop()
                      }
                      onChange={(value: any) => {
                        let path = "#/components/schemas/" + value;
                        setAdditionalPropertiesPath(path);
                      }}
                      set={properties[property]["x-anyOf"].map((a: any) =>
                        a["$ref"].split("/").pop()
                      )}
                    />
                    {additionalPropertiesPath &&
                      createOpenApiList(additionalPropertiesPath, property)}
                  </div>
                )}
                {properties[property]["$ref"] &&
                  openApi &&
                  createOpenApiList(properties[property]["$ref"], property)}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default OpenApiList;
