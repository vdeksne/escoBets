/** One card in the home-page X (Twitter) carousel. */
export type XTweetCard = {
  id: string;
  name: string;
  handle: string;
  date: string;
  verified: boolean;
  content: string;
  profileImageUrl: string | null;
  mediaUrl: string | null;
  xPostUrl: string;
  replies: string;
  retweets: string;
  likes: string;
  views: string | null;
};
