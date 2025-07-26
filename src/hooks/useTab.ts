import { sandboxActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateTab } = sandboxActions;

export const useTab = (tabParam: any) => {
    const dispatch = useDispatch();
    const tab = useSelector((state: RootState) => state.sandbox);

    useEffect(() => {
        if (tabParam) {
            dispatch(updateTab(tabParam));
        }
    }, [tabParam, dispatch]);
    
    return tab;
};


