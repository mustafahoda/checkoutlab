import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sandboxActions } from "@/store/reducers";

const { updateTheme } = sandboxActions;

const useThemeInStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme && (theme === "light" || theme === "dark")) {
      dispatch(updateTheme(theme as "light" | "dark"));
    } else {
      const defaultTheme = "light";
      localStorage.setItem("theme", defaultTheme);
      dispatch(updateTheme(defaultTheme));
    }
  }, [dispatch]);
};

export default useThemeInStorage; 