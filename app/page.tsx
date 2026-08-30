import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listCompanions } from "@/lib/companions";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemTitle
} from "@/components/ui/item";
import ShelfProgress from "./components/ShelfProgress";

export default function Shelf() {
  const papers = listCompanions();

  return (
    <>
      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">论文伴读</h1>
        <p className="text-sm text-muted-foreground">
          一次一块，一块十分钟。点开就能读。
        </p>
      </header>
      {papers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          书架还空着。
        </p>
      ) : (
        <ItemGroup>
          {papers.map((p) => {
            const totalMinutes = p.chunks.reduce((s, c) => s + c.minutes, 0);
            const counts = { close: 0, skim: 0, skip: 0 };
            p.chunks.forEach((c) => {
              counts[c.intensity ?? "close"] += 1;
            });
            const hasIntensity = p.chunks.some((c) => c.intensity);
            return (
              <Item key={p.id} asChild variant="outline" className="items-start">
                <Link href={`/papers/${p.id}`} className="no-underline">
                  <ItemContent>
                    <ItemTitle className="line-clamp-none whitespace-normal text-base">
                      {p.title}
                    </ItemTitle>
                    <ItemDescription>{p.venue}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </ItemActions>
                  <ItemFooter className="flex-col items-stretch gap-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{p.chunks.length} 块</Badge>
                      <Badge variant="outline">约 {totalMinutes} 分钟</Badge>
                      {hasIntensity ? (
                        <>
                          <Badge variant="outline">精读 {counts.close}</Badge>
                          <Badge variant="outline">选读 {counts.skim}</Badge>
                          <Badge variant="outline">跳过 {counts.skip}</Badge>
                        </>
                      ) : null}
                    </div>
                    <ShelfProgress paperId={p.id} chunkCount={p.chunks.length} />
                  </ItemFooter>
                </Link>
              </Item>
            );
          })}
        </ItemGroup>
      )}
    </>
  );
}
