import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 代わりに静的なユーザーリストを使用します
  const users = [{ id: "user1" }, { id: "user2" }, { id: "user3" }];

  return [
    {
      url: "https://precedent.dev",
      lastModified: new Date(),
    },
    ...users.map((user) => ({
      url: `https://precedent.dev/${user.id}`,
      lastModified: new Date(),
    })),
  ];
}
