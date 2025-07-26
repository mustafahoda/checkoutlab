import Enum from "@/components/custom/sandbox/editors/Enum";

const VersionCompact = (props: any) => {
  const { label, value, options, onChange } = props;

  const optionsArray = options.map((value: any) => {
    return "v" + value;
  });

  return (
    <div className="flex items-center">
      <p className="text-[0.82rem] pr-2 text-foreground font-bold">{`${label}`}</p>
      <div>
        <Enum
          value={`v${value}`}
          set={optionsArray}
          title="Checkout API Version"
          onChange={(value: any) => {
            onChange(value.replace("v", ""));
          }}
          className="text-adyen border-none p-0 text-xs shadow-none bg-card"
        />
      </div>
    </div>
  );
};

export default VersionCompact;
