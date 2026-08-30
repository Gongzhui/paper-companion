"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

export function Aside({ children }: { children: React.ReactNode }) {
  return (
    <Collapsible className="group my-4 rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground">
        导游怎么说
        <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 py-3 text-sm leading-7">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
