// Removed dotenv import and config since no env vars are used now

import { DocumentInterface } from "@langchain/core/documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function generateEmbeddings() {
  // No external services or env vars used here

  const routeLoader = new DirectoryLoader(
    "src/app",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true,
  );

  const routes = (await routeLoader.load())
    .filter((route) => route.metadata.source.endsWith("page.tsx"))
    .map((route): DocumentInterface => {
      const url =
        route.metadata.source
          .replace(/\\/g, "/")
          .split("/src/app")[1]
          .split("/page.tsx")[0] || "/";

      const pageContentTrimmed = route.pageContent
        .replace(/^import.*$/gm, "")
        .replace(/ className=(["']).*?\1| className={.*?}/g, "")
        .replace(/^\s*[\r]/gm, "")
        .trim();

      return { pageContent: pageContentTrimmed, metadata: { url } };
    });

  const routesSplitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const splitRoutes = await routesSplitter.splitDocuments(routes);

  const dataLoader = new DirectoryLoader("src/data", {
    ".json": (path) => new TextLoader(path),
  });

  const data = await dataLoader.load();
  const dataSplitter = RecursiveCharacterTextSplitter.fromLanguage("js");
  const splitData = await dataSplitter.splitDocuments(data);

  const postLoader = new DirectoryLoader(
    "content",
    {
      ".mdx": (path) => new TextLoader(path),
    },
    true,
  );

  const posts = (await postLoader.load())
    .filter((post) => post.metadata.source.endsWith(".mdx"))
    .map((post): DocumentInterface => {
      const pageContentTrimmed = post.pageContent.split("---")[1];
      return { pageContent: pageContentTrimmed, metadata: post.metadata };
    });

  const postSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown");
  const splitPosts = await postSplitter.splitDocuments(posts);

  // No vector store, Redis, Astra DB, or OpenAI calls here

  console.log("Embeddings processing completed (no external services used).");
}

generateEmbeddings();
