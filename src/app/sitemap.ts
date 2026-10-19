import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://yashsehrawat.in", changeFrequency: "weekly", priority: 1 }];
}
