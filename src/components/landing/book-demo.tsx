import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BookDemo() {
  return (
    <section id="book-demo" className="px-4 py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
        <p className="text-center text-lg text-white md:text-left">
          See how we can work for you.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 shrink-0"
          asChild
        >
          <Link href="/demo">
            <Plus className="h-5 w-5" />
            Book a Demo
          </Link>
        </Button>
      </div>
    </section>
  );
}
