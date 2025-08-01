import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// Removed: import { getEmbeddingsCollection, getVectorStore } from "../src/lib/vectordb";

async function generateEmbeddings() {
  // Removed vectorStore usage and embeddings collection
  // const vectorStore = await getVectorStore();
  // (await getEmbeddingsCollection()).deleteMany({});
  (await Redis.fromEnv()).flushdb();

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

  // Disabled adding to vectorStore since it no longer exists
  // await vectorStore.addDocuments(splitRoutes);
  // await vectorStore.addDocuments(splitData);
  // await vectorStore.addDocuments(splitPosts);

  console.log("Embeddings processing completed. Vector storage disabled.");
}

generateEmbeddings();
