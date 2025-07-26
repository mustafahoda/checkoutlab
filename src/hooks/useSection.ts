import { sandboxActions, userActions } from "@/store/reducers";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateSandboxSection } = sandboxActions;

export const useSection = (sectionParam: any) => {
    const dispatch = useDispatch();
    const section = useSelector((state: RootState) => state.sandbox);

    useEffect(() => {
        if (sectionParam && ["Client", "Server", "Style", "Demo"].includes(sectionParam)) {
            dispatch(updateSandboxSection(sectionParam as "Client" | "Server" | "Style" | "Demo"));
        }
    }, [sectionParam, dispatch]);
    return section;
};


