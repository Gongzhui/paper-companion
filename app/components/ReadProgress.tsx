"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ReadProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setValue(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Progress
      value={value}
      className="fixed top-0 left-0 z-50 h-0.5 rounded-none"
      aria-hidden
    />
  );
}
