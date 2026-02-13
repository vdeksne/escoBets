import Link from "next/link";

const deals = [
  {
    title: "Giveaways & Gifts",
    date: "10/18/2026",
    gradient: "from-amber-500/80 to-orange-600/80",
  },
  {
    title: "Buy One, Get One",
    date: "11/1/2026",
    gradient: "from-emerald-500/80 to-teal-600/80",
  },
  {
    title: "Referral Program",
    date: "10/30/2026",
    gradient: "from-violet-500/80 to-purple-600/80",
  },
];

export function NewDeals() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          New <span className="text-escobets-yellow">Deals</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {deals.map((deal, i) => (
            <Link
              key={i}
              href="/deals"
              className="group overflow-hidden rounded-xl border border-white/10 bg-escobets-gray-card transition hover:border-escobets-yellow/50"
            >
              <div
                className={`h-40 bg-gradient-to-br ${deal.gradient} flex items-center justify-center text-2xl font-bold text-white/90`}
              >
                Deal
              </div>
              <div className="p-4">
                <p className="font-semibold text-white group-hover:text-escobets-yellow">
                  {deal.title}
                </p>
                <p className="text-sm text-white/60">{deal.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
