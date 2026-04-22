import { redirect } from "next/navigation";

/** @deprecated list moved to /updates — this URL is kept for bookmarks. */
export default function AdminNewsListRedirect() {
  redirect("/updates");
}
