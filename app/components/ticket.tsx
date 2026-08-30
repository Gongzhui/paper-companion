"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import type { TicketItem } from "@/lib/companions";

export function Ticket({ items }: { items: TicketItem[] }) {
  return (
    <section className="mt-8 rounded-lg border border-border">
      <div className="px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground">
        出站票 · 答不上来就翻回去
      </div>
      <div className="border-t border-border">
        {items.map((item, i) => (
          <Collapsible
            key={i}
            className="group border-b border-border last:border-b-0"
          >
            <CollapsibleTrigger className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted/50">
              <span>
                <span className="mr-2 text-muted-foreground">Q.</span>
                {item.q}
              </span>
              <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 text-sm leading-6 text-muted-foreground">
              {item.a}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </section>
  );
}
