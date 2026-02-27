import Image from "next/image";

type PromoBannerProps = {
  /** Promo image URL. Defaults to /images/Ad.png; later can come from Supabase. */
  imageSrc?: string;
};

export function PromoBanner({ imageSrc = "/images/Ad.png" }: PromoBannerProps = {}) {
  return (
    <section className="px-4 py-6">
      <div className="container mx-auto">
        <div className="relative aspect-[3/1] w-full min-h-[120px] overflow-visible rounded-lg md:min-h-[160px]">
          <div className="absolute inset-4 md:inset-6">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
