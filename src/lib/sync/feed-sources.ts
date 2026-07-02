/** Public IT education feeds (no proprietary scraping). */

export interface FeedSource {
  id: string;
  name: string;
  category: string;
}

export const FEED_SOURCES: FeedSource[] = [
  { id: "devto", name: "Dev.to", category: "Web Dev" },
  { id: "hackernews", name: "Hacker News", category: "Tech" },
  { id: "freecodecamp", name: "freeCodeCamp", category: "Programming" },
];

export interface FeedItemInput {
  external_id: string;
  source: string;
  title: string;
  url: string;
  summary: string | null;
  category: string;
  published_at: string | null;
}
