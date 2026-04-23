import Image from "next/image";

type PromoBannerProps = {
  /** Promo image URL. Defaults to /images/Ad.png; later can come from Supabase. */
  imageSrc?: string;
};

/**
 * Responsive, full-width art with no cropping: intrinsic scaling (`w-full` + `h-auto`).
 * No border/shadow; any frame in the UI was removed so only the file content shows.
 * If the PNG itself includes a yellow outline or side bars, replace the asset to drop those.
 */
export function PromoBanner({ imageSrc = "/images/Ad.png" }: PromoBannerProps = {}) {
  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Image
          src={imageSrc}
          alt="EscoBets promotion"
          width={1920}
          height={640}
          className="h-auto w-full max-w-full select-none"
          sizes="(max-width: 1280px) 100vw, 1152px"
          priority={false}
        />
      </div>
    </section>
  );
}
