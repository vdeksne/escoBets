import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";
import { MOCK_NEWS_ARTICLES } from "@/lib/news/mock-data";

/** Placeholder article page – backend: fetch by slug */
export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_NEWS_ARTICLES.find(
    (a) => a.id === slug || a.slug === slug
  ) ?? MOCK_NEWS_ARTICLES[0];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-gotham text-escobets-yellow hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
          <article className="mt-8">
            <p className="font-gotham text-sm text-white/60">{article.date}</p>
            <h1 className="mt-2 font-gotham text-3xl font-bold text-white">
              {article.headline}
            </h1>
            <p className="mt-4 font-gotham text-white/80">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/30 bg-white/5 px-3 py-1 font-gotham text-xs text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
