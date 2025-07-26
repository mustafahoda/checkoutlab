import Enum from "@/components/custom/sandbox/editors/Enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Version = (props: any) => {
  const { label, value, options, onChange } = props;
  return (
    <Accordion type="multiple" className="w-full py-0 border-b-[1px]">
      <AccordionItem value="item-1">
        <AccordionTrigger className="py-3 px-4 border-transparent border-[1px] hover:border-[1px] hover:border-adyen hover:border-dotted">
          <h4 className="text-[0.95rem] text-adyen">
            {`${label}`}
            <code className="px-1 text-xs text-grey">{`v${value}`}</code>
          </h4>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-xs px-4 pb-1 text-foreground">
            {`Change the version of ${label}`}
          </p>
          <div className="px-3">
            <Enum
              value={value}
              set={options}
              title="Checkout API Version"
              onChange={(value: any) => {
                onChange(value);
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Version;
