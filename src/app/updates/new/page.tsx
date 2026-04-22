import { redirect } from "next/navigation";

/** @deprecated — use /admin/news/new */
export default function NewNewsPostPage() {
  redirect("/admin/news/new");
}
