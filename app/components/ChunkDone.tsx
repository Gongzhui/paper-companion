"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ChunkDone({
  paperId,
  chunkId
}: {
  paperId: string;
  chunkId: string;
}) {
  const key = `pc:${paperId}:chunks`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setDone(!!JSON.parse(raw)[chunkId]);
    } catch {}
  }, [key, chunkId]);

  const toggle = () => {
    const next = !done;
    setDone(next);
    try {
      const raw = localStorage.getItem(key);
      const obj = raw ? JSON.parse(raw) : {};
      obj[chunkId] = next;
      localStorage.setItem(key, JSON.stringify(obj));
    } catch {}
  };

  return (
    <div className="mt-5 flex justify-end">
      <Button
        type="button"
        variant={done ? "default" : "outline"}
        size="sm"
        onClick={toggle}
      >
        {done ? "已读完" : "这一块读完了"}
      </Button>
    </div>
  );
}
