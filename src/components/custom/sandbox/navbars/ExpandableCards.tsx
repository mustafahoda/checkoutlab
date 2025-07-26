"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  SquareTerminal
} from "lucide-react";
import { useState } from "react";

interface ExpandableCardsProps {
  paymentMethodName: string;
  paymentMethodType: string;
  defaultExpanded: boolean;
  defaultIntegration: string;
  onItemClick: (route: string) => void;
}

export function ExpandableCards(props: ExpandableCardsProps) {
  const { defaultExpanded, defaultIntegration, onItemClick } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full px-5">
      <div className="border-l-[1px] px-1">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 py-[3px] h-auto flex flex-auto w-full justify-start text-sm text-foreground !py-none border-transparent shadow-none rounded-lg font-thin"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 pr-1 text-grey" />
          ) : (
            <ChevronRight className="h-4 w-4 pr-1 text-grey" />
          )}
          <span className="flex items-center">{props.paymentMethodName}</span>
        </Button>
        {isExpanded && (
          <div className="flex flex-col justify-start pl-2 border-l-[1px] ml-1">
            <Button
              variant="ghost"
              className="pl-1 h-auto py-1 text-sm text-foreground border-transparent shadow-none rounded-lg justify-start"
              asChild
            >
              <Link
                href={`/sessions/${props.paymentMethodType}`}
                className="flex items-baseline"
                onClick={() => {
                  onItemClick(`/sessions/${props.paymentMethodType}`);
                }}
              >
                <Clock className="h-3 w-3 mb-1 text-adyen" />
                <span
                  className={`pl-2 text-sm ${
                    defaultIntegration === "sessions" && defaultExpanded
                      ? ""
                      : "font-thin"
                  }`}
                >
                  sessions
                </span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="pl-1 h-auto py-1 text-sm text-foreground border-transparent shadow-none rounded-lg justify-start"
              asChild
            >
              <Link
                href={`/advance/${props.paymentMethodType}`}
                className="flex items-baseline"
                onClick={() => {
                  onItemClick(`/advance/${props.paymentMethodType}`);
                }}
              >
                <SquareTerminal className="h-3 w-3 mb-1 text-preview" />
                <span
                  className={`pl-2 text-sm ${
                    defaultIntegration === "advance" && defaultExpanded
                      ? ""
                      : "font-thin"
                  }`}
                >
                  advance
                </span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
