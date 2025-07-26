import { Input } from "@/components/ui/input";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Array = (props: any) => {
  const { value, onChange } = props;
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onChange([...value, input]);
    setInput("");
  };

  return (
    <div>
      {value?.map?.((item: any, index: number) => (
        <div key={index} className="flex items-center pb-2">
          <Input
            className="text-xs py-0 rounded-r-none"
            value={item}
            onChange={(e: any) => {
              const newValue = [...value];
              newValue[index] = e.target.value;
              onChange(newValue);
            }}
          />
          <Button
            variant="default"
            color="danger"
            size="icon"
            className="pt-0 rounded-l-none"
            onClick={() => {
              const newValue = [...value];
              newValue.splice(index, 1);
              onChange(newValue);
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: "12px" }} />
          </Button>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex">
        <Input
          className="text-xs py-0 rounded-r-none"
          value={input}
          onChange={(e: any) => {
            setInput(e.target.value);
          }}
        />
        <Button
          type="submit"
          variant="default"
          color="primary"
          size="icon"
          className="pt-0 rounded-l-none"
        >
          <AddIcon sx={{ fontSize: "12px" }} />
        </Button>
      </form>
    </div>
  );
};
export default Array;
