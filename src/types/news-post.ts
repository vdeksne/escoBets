/**
 * News/post admin type – for Updates (News and Predictions Admin).
 * Backend: replace with CMS/API schema.
 */

export type NewsPostStatus = "Live" | "Completed" | "Pending" | "Canceled";

export interface NewsPostAdmin {
  id: string;
  title: string;
  thumbnailUrl: string;
  date: string;
  status: NewsPostStatus;
}
