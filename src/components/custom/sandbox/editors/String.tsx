import { Input } from "@/components/ui/input";

export const String = (props: any) => {
  const { value, onChange } = props;

  return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
};
