import { sandboxActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateView } = sandboxActions;

export const useView = (viewParam: any) => {
  const dispatch = useDispatch();
  const view = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (viewParam && ["developer", "preview"].includes(viewParam)) {
      dispatch(updateView(viewParam as "developer" | "preview"));
    }
  }, [viewParam, dispatch]);
  return view;
};


