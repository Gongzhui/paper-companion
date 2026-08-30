import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between px-4">
        <a
          href="https://wiki.gongzhui.me"
          className="flex items-center gap-2 text-sm font-medium text-foreground no-underline"
        >
          <Logo className="size-5" />
          Gongzhui
        </a>
        <Link
          href="/"
          className="text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          论文伴读
        </Link>
      </div>
    </header>
  );
}
