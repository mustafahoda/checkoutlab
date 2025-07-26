import { Input } from "@/components/ui/input";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import React, { useRef, useEffect } from "react";

const Search = (props: any) => {
  const { onChange, properties, description, label, method, tab, children, onCheckedChange, checked } =
    props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="z-10 sticky top-0 bg-card">
      <div className="flex items-center justify-between">
        <h4 className="text-[1rem] text-adyen font-bold z-15 sticky top-0 px-5 pt-3">
          {`${label}`}
          {method && (
            <code className="px-1 text-xs text-grey font-normal">{method}</code>
          )}
        </h4>
        <div className="items-center space-x-2 px-5 pt-3 hidden lg:flex">
          <p className="text-xs text-grey font-normal">{`${checked ? "less code" : "more code"}`}</p>
          <Switch id="dev-mode" onCheckedChange={onCheckedChange} checked={checked} />
        </div></div>
      <div className="px-6 pt-0">{children}</div>
      <p className="text-[0.8rem] text-grey px-6">{`${description}`}</p>
      <div className="flex pb-3 pt-2 px-3">
        <Input
          className="text-xs py-0 rounded-r-none"
          ref={inputRef}
          type="search"
          placeholder="search"
          onChange={(e: any) => {
            let search = e.target.value;
            if (search) {
              const filtered = Object.keys(properties).filter((key) =>
                key.toLowerCase().includes(search.toLowerCase())
              );
              onChange(
                filtered.reduce((obj: any, key) => {
                  obj[key] = properties[key];
                  return obj;
                }, {})
              );
            } else {
              onChange(properties);
            }
          }}
        />
        <Button
          key="run"
          variant="default"
          size="icon"
          className="pt-0 rounded-l-none bg-adyen text-[#fff]"
          spellCheck={false}
        >
          <SearchIcon sx={{ fontSize: "12px" }} />
        </Button>
      </div>
    </div>
  );
};

export default Search;
