import rss from "@astrojs/rss";

export function GET() {
  let allPosts = import.meta.glob("./posts/*.md", { eager: true });
  let posts = Object.values(allPosts);

  posts = posts.sort((a, b) => {
    const getPostNumber = (url) =>
      parseInt(url.split("/posts/")[1].split("-")[0]);
    return getPostNumber(b.url) - getPostNumber(a.url);
  });

  // Only 12 are kept
  posts = posts.slice(0, 12);

  return rss({
    title: "notes4ever",
    description: "notes4ever",
    site: "https://unixtea.com",
    items: posts.map((item) => {
      const [issueNumber, issueTitle] = item.url.split("/posts/")[1].split("-");
      const title = `第${issueNumber}期 - ${issueTitle}`;
      return {
        link: item.url,
        title,
        description: item.compiledContent(),
        pubDate: item.frontmatter.date,
      };
    }),
  });
}
