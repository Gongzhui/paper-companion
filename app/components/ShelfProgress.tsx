"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ShelfProgress({
  paperId,
  chunkCount
}: {
  paperId: string;
  chunkCount: number;
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`pc:${paperId}:chunks`);
      if (raw) setDone(Object.values(JSON.parse(raw)).filter(Boolean).length);
    } catch {}
  }, [paperId]);

  const pct = chunkCount ? (done / chunkCount) * 100 : 0;
  return (
    <Progress
      value={pct}
      aria-label={`已完成 ${done}/${chunkCount} 块`}
    />
  );
}
