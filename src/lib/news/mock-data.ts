import type { NewsArticle } from "@/types/news";

/** Images from images/news – replace with real article images from backend */
const IMAGES = [
  "/images/news/news.jpg",
  "/images/news/news2.jpg",
  "/images/news/news3.jpg",
  "/images/news/news4.jpg",
  "/images/news/news5.jpg",
  "/images/news/news6.jpg",
  "/images/news/news7.jpg",
  "/images/news/news8.jpg",
  "/images/news/news9.jpg",
];

/**
 * Mock articles – REMOVE when backend is ready.
 * Replace with: useSWR('/api/news', fetcher) or CMS query.
 */
export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    imageUrl: IMAGES[0],
    date: "Sunday, 1 Jan 2026",
    headline: "UX review presentations",
    excerpt:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: ["Design", "Research"],
  },
  {
    id: "2",
    imageUrl: IMAGES[1],
    date: "Sunday, 1 Jan 2026",
    headline: "Migrating to Linear 101",
    excerpt:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get...",
    tags: ["Design", "Research"],
  },
  {
    id: "3",
    imageUrl: IMAGES[2],
    date: "Sunday, 1 Jan 2026",
    headline: "Building your API Stack",
    excerpt:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and manag...",
    tags: ["Design", "Research"],
  },
  {
    id: "4",
    imageUrl: IMAGES[3],
    date: "Sunday, 1 Jan 2026",
    headline: "Climate Endgame: Exploring catastrophic climate change scenarios",
    tags: ["Environment", "Research"],
  },
  {
    id: "5",
    imageUrl: IMAGES[4],
    date: "Sunday, 1 Jan 2026",
    headline: "Grid system for better Design User Interface",
    excerpt:
      "A grid system is a design tool used to arrange content on a webpage. It is a series of vertical and horizontal lines that create a matrix of intersecting points, which can be used to align and organize page elements.",
    tags: ["Design", "Interface"],
  },
  {
    id: "6",
    imageUrl: IMAGES[5],
    date: "Sunday, 1 Jan 2026",
    headline: "Bill Walsh leadership lessons",
    excerpt:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    tags: ["Leadership", "Management", "Presentation"],
  },
  {
    id: "7",
    imageUrl: IMAGES[6],
    date: "Sunday, 1 Jan 2026",
    headline: "PM mental models",
    excerpt:
      "Mental models are simple expressions of complex processes or relationships.",
    tags: ["Product", "Research", "Frameworks"],
  },
  {
    id: "8",
    imageUrl: IMAGES[7],
    date: "Sunday, 1 Jan 2026",
    headline: "What is Wireframing?",
    excerpt:
      "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: ["Design", "Research", "Presentation"],
  },
  {
    id: "9",
    imageUrl: IMAGES[8],
    date: "Sunday, 1 Jan 2026",
    headline: "How collaboration makes us better designers",
    excerpt:
      "Collaboration can make our teams stronger, and our individual designs better.",
    tags: ["Design", "Research", "Presentation"],
  },
  {
    id: "10",
    imageUrl: IMAGES[0],
    date: "Sunday, 1 Jan 2026",
    headline: "Our top 10 Javascript frameworks to use",
    excerpt:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    tags: ["Software Development", "Tools", "SaaS"],
  },
  {
    id: "11",
    imageUrl: IMAGES[1],
    date: "Sunday, 1 Jan 2026",
    headline: "Podcast: Creating a better CX Community",
    excerpt:
      "Starting a community doesn't need to be complicated, but how do you get started?",
    tags: ["Podcasts", "Customer Success", "Presentation"],
  },
];
