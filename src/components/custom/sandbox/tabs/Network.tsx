import Code from "@/components/custom/sandbox/editors/Code";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

const Network = (props: any) => {
    const { theme } = props;
    const { networkResponse } = useSelector((state: RootState) => state.sandbox);

    // Helper function to get status color
    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return "border-adyen";
        if (status >= 300 && status < 400) return "border-info";
        if (status >= 400 && status < 500) return "border-warning";
        if (status >= 500) return "border-destructive";
        return "border-muted";
    };

    // Helper function to format URL
    const formatUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname;
        } catch (e) {
            return url;
        }
    };

    return (
        <div className="flex h-full px-6 pt-2 pb-6">
            <Accordion type="multiple" className="overflow-auto w-full border-[1px] rounded-lg p-[1px] border-border bg-card">
                {networkResponse.map((response: any, index: number) => (
                    <AccordionItem key={`${response.url}-${index}`} value={`${response.url}-${index}`} className="border-b border-border">
                        <AccordionTrigger className="px-4 py-3 hover:bg-accent transition-colors">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-3">
                                    <div className={`${getStatusColor(response.status)} border-2 rounded-md text-foreground bg-card font-thin font-mono text-xs px-2 py-0.5`}>
                                        {response.status}
                                    </div>
                                    <span className={`font-mono text-xs uppercase px-2 py-0.5 ${response.method === 'GET' ? 'text-info' :
                                        response.method === 'POST' ? 'text-adyen' :
                                            response.method === 'PUT' ? 'text-js' :
                                                response.method === 'DELETE' ? 'text-warning' : 'text-grey'
                                        }`}>
                                        {response.method}
                                    </span>
                                    <span className="text-xs font-medium truncate max-w-md text-foreground">
                                        {formatUrl(response.url)}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground px-2">
                                    {new Date(response.time).toLocaleTimeString()}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-2 bg-card">
                            <div className="rounded-md border border-border">
                                <Code code={JSON.stringify(response.data, null, 2)} theme={theme} type="json" readOnly={true} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                {networkResponse.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                        No network requests captured yet
                    </div>
                )}
            </Accordion>
        </div>
    );
};

export default Network;