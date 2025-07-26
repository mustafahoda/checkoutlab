import { HexColorPicker } from "react-colorful";

const Color = (props: any) => {
  const { value, onChange } = props;
  return (
    <HexColorPicker
      color={value}
      onChange={(value) => {
        onChange(value);
      }}
      style={{
        width: "100%",
      }}
    />
  );
};

export default Color;
