import Link from "next/link";
import katex from "katex";
import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import { getCompanion, listCompanions, type Block } from "@/lib/companions";
import { Badge } from "@/components/ui/badge";
import { Aside } from "../../components/aside";
import { Ticket } from "../../components/ticket";
import ReadProgress from "../../components/ReadProgress";
import ChunkDone from "../../components/ChunkDone";

export function generateStaticParams() {
  return listCompanions().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const paper = getCompanion((await params).id);
  return { title: paper?.title ?? "论文伴读" };
}

const INTENSITY = {
  close: { label: "精读", variant: "default" as const },
  skim: { label: "选读", variant: "secondary" as const },
  skip: { label: "跳过", variant: "outline" as const }
};

function katexHtml(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { displayMode, throwOnError: false });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\{\{[^}]+::[^}]+\}\}|\$[^$\n]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const m = part.match(/^\{\{(.+?)::([\s\S]+)\}\}$/);
    if (m) {
      return (
        <details key={i} className="term">
          <summary>{m[1]}</summary>
          <span className="term-def">{m[2]}</span>
        </details>
      );
    }
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: katexHtml(part.slice(1, -1), false) }}
        />
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function isMarkdownTable(block: string): boolean {
  const lines = block.trim().split("\n").filter((l) => l.trim());
  return lines.length >= 2 && lines.every((l) => l.trim().startsWith("|"));
}

function MarkdownTable({ block }: { block: string }) {
  const rows = block
    .trim()
    .split("\n")
    .map((l) =>
      l
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim())
    )
    .filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)));
  const [head, ...body] = rows;
  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {head.map((c, i) => (
              <th
                key={i}
                className="border border-border px-2.5 py-1.5 text-left font-medium whitespace-nowrap"
              >
                {renderInline(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="border border-border px-2.5 py-1.5 align-top">
                  {renderInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RichBlocks({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((block, i) =>
        isMarkdownTable(block) ? (
          <MarkdownTable key={i} block={block} />
        ) : (
          <p key={i} className="my-2">
            {renderInline(block)}
          </p>
        )
      )}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "para":
      return <p className="original">{renderInline(block.text)}</p>;
    case "math":
      return (
        <div
          className="math-block"
          dangerouslySetInnerHTML={{ __html: katexHtml(block.tex, true) }}
        />
      );
    case "figure":
      return (
        <figure className="my-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.caption}
            loading="lazy"
            className="mx-auto max-w-full rounded-lg bg-white"
          />
          <figcaption className="mt-2 text-left text-xs leading-5 text-muted-foreground">
            {block.caption}
          </figcaption>
        </figure>
      );
    case "aside":
      return (
        <Aside>
          <RichBlocks text={block.text} />
        </Aside>
      );
    case "terms":
      return (
        <section className="my-5 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
            这一块的黑话
          </div>
          <dl>
            {block.items.map((t) => (
              <div key={t.term} className="mt-2">
                <dt className="font-medium">{t.term}</dt>
                <dd className="mt-0.5 text-muted-foreground">{t.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
  }
}

export default async function PaperPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getCompanion(id);
  if (!paper) notFound();

  return (
    <>
      <ReadProgress />
      <header className="border-b border-border pb-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          书架
        </Link>
        <h1 className="mt-3 text-xl leading-snug font-semibold tracking-tight">
          {paper.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{paper.venue}</p>
      </header>

      <nav className="flex flex-wrap gap-2 py-4">
        {paper.chunks.map((c) => (
          <Badge key={c.id} variant="outline" asChild>
            <a href={`#${c.id}`} className="no-underline">
              {c.title}
            </a>
          </Badge>
        ))}
      </nav>

      <section className="mb-10 rounded-lg border border-border bg-card px-4 py-3 text-sm leading-7">
        <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          先花两分钟看地图
        </div>
        <RichBlocks text={paper.map} />
      </section>

      {paper.chunks.map((chunk, ci) => (
        <section key={chunk.id} id={chunk.id} className="mt-12 scroll-mt-4">
          <h2 className="mb-1 flex flex-wrap items-baseline gap-2 text-lg font-semibold tracking-tight">
            <span>
              {ci + 1}. {chunk.title}
            </span>
            {chunk.intensity ? (
              <Badge variant={INTENSITY[chunk.intensity].variant}>
                {INTENSITY[chunk.intensity].label}
              </Badge>
            ) : null}
            <span className="text-xs font-normal text-muted-foreground">
              约 {chunk.minutes} 分钟
            </span>
          </h2>
          {chunk.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
          <Ticket items={chunk.ticket} />
          <ChunkDone paperId={paper.id} chunkId={chunk.id} />
        </section>
      ))}

      <section className="mt-16 rounded-lg border border-dashed border-border px-4 py-4">
        <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
          回流 · 用自己的话沉淀
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {paper.outro.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
