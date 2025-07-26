import Color from "@/components/custom/sandbox/editors/Color";
import Enum from "@/components/custom/sandbox/editors/Enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FomulaSlider from "../FomulaSlider";
import CssImportant from "../CssImportant";

export const OpenCssList = (props: any) => {
  const {
    selectedProperties,
    properties,
    values,
    setValues,
    onChange,
    disabled,
  } = props;
  const propertyKeys = properties ? Object.keys(properties) : [];

  // Update handlers to add/remove highlight class
  const handleMouseEnter = (propertyValue: string) => {
    // Remove leading dot if present
    const className = propertyValue.replace(/^\./, "");
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach((element) => {
      element.classList.add("highlight-green");
    });
  };

  const handleMouseLeave = (propertyValue: string) => {
    // Remove leading dot if present
    const className = propertyValue.replace(/^\./, "");
    const elements = document.getElementsByClassName(className);
    Array.from(elements).forEach((element) => {
      element.classList.remove("highlight-green");
    });
  };

  return (
    <Accordion
      type="multiple"
      className="w-full px-3"
      value={selectedProperties}
      onValueChange={onChange}
      disabled={disabled}
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
            <AccordionTrigger
              className="px-4 pt-2 pb-1 border-transparent hover:bg-muted flex flex-col"
              onMouseEnter={
                properties[property].type === "class"
                  ? () => handleMouseEnter(property)
                  : undefined
              }
              onMouseLeave={
                properties[property].type === "class"
                  ? () => handleMouseLeave(property)
                  : undefined
              }
            >
              <div className="flex justify-start w-full items-center mb-2">
                <p className="text-[0.85rem] text-foreground">{property}</p>
                <p className="font-mono text-xs flex-grow text-left">
                  {properties[property].type && (
                    <span className="pl-2 text-grey">
                      {properties[property].type}
                    </span>
                  )}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 pr-4">
                <p className="w-full text-xs pb-2 text-grey text-left no-underline">
                  {properties[property].description}
                </p>
                {properties[property].type === "color" && values && (
                  <CssImportant
                    value={values[property] ? values[property] : "#000000;"}
                    onChange={(value: string) => {
                      setValues(
                        { ...values, [property]: value },
                        property,
                        value,
                        "string"
                      );
                    }}
                  >
                    <Color
                      value={
                        values[property]
                          ? values[property].replace(/\s*!important\s*;/, ";")
                          : "#000000"
                      }
                    />
                  </CssImportant>
                )}
                {properties[property].type === "font-family" && values && (
                  <CssImportant
                    value={values[property] ? values[property] : "Arial;"}
                    onChange={(value: string) => {
                      setValues(
                        { ...values, [property]: value },
                        property,
                        value,
                        "string"
                      );
                    }}
                  >
                    <Enum
                      value={
                        values[property]
                          ? values[property]
                              .replace(/\s*!important\s*;/, ";")
                              .replace(/;/g, "")
                          : "Arial"
                      }
                      disabled={disabled}
                      set={properties[property].values.map((value: any) =>
                        value.replace(/'/g, "")
                      )}
                    />
                  </CssImportant>
                )}
                {properties[property].type === "size" && values && (
                  <CssImportant
                    value={
                      values[property] ? values[property] : "14px !important;"
                    }
                    onChange={(value: string) => {
                      setValues(
                        { ...values, [property]: value },
                        property,
                        value,
                        "string"
                      );
                    }}
                  >
                    <FomulaSlider
                      value={values[property] ? parseInt(values[property]) : 14}
                      max={25}
                    />
                  </CssImportant>
                )}
                {properties[property].type === "class" && (
                  <div className="border-l-[1px]">
                    <OpenCssList
                      selectedProperties={
                        values &&
                        values[property] &&
                        Object.keys(values[property])
                          ? Object.keys(values[property])
                          : []
                      }
                      properties={properties[property].additionalProperties}
                      disabled={disabled}
                      values={values[property]}
                      setValues={(value: any) => {
                        setValues({ ...values, [property]: value });
                      }}
                      onChange={(value: any) => {
                        const configParameters =
                          values &&
                          values[property] &&
                          Object.keys(values[property]);
                        const isNewProperty =
                          configParameters.length < value.length;
                        if (isNewProperty) {
                          const latestKey = value[value.length - 1];
                          const latestValue =
                            properties[property].additionalProperties[
                              latestKey
                            ];
                          let newProperty = null;
                          if (latestValue.type === "class") {
                            newProperty = { [latestKey]: {} };
                          } else if (latestValue.type === "font-family") {
                            newProperty = { [latestKey]: "Arial !important;" };
                          } else if (latestValue.type === "size") {
                            newProperty = { [latestKey]: "14px !important;" };
                          } else if (latestValue.type === "color") {
                            newProperty = {
                              [latestKey]: "#000000 !important;",
                            };
                          }
                          let mergedProperties = {
                            ...values[property],
                            ...newProperty,
                          };
                          setValues(
                            {
                              ...values,
                              [property]: mergedProperties,
                            },
                            property,
                            mergedProperties,
                            "object"
                          );
                        } else {
                          const removedProperties: any =
                            configParameters.filter((i: any) => {
                              return value.indexOf(i) < 0;
                            });
                          if (removedProperties.length > 0) {
                            let updatedRequest = { ...values[property] };
                            let removedProperty = removedProperties.pop();
                            delete updatedRequest[removedProperty];
                            setValues({
                              ...values,
                              [property]: updatedRequest,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};
