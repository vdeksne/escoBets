import Image from "next/image";
import Link from "next/link";

const deals = [
  {
    title: "Giveaway & Gifts",
    date: "10/10/2026",
    image: "/images/newDeals/Image.png",
  },
  {
    title: "Buy One, Get One",
    date: "10/11/2026",
    image: "/images/newDeals/Image-1.png",
  },
  {
    title: "Referral Program",
    date: "20/9/2026",
    image: "/images/newDeals/Image-2.png",
  },
];

export function NewDeals() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
          New{" "}
          <span
            className="text-[#FBFE27]"
            style={{ textShadow: "0 0 66.667px #FBFE27" }}
          >
            Deals
          </span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {deals.map((deal, i) => (
            <Link
              key={i}
              href="/deals"
              className="group overflow-hidden rounded-xl border border-white/10 bg-escobets-gray-card transition hover:border-escobets-yellow/50"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="font-bold text-white transition group-hover:text-escobets-yellow">
                  {deal.title}
                </p>
                <p className="mt-1 text-sm text-white/60">{deal.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
