"use client";

import { PostMetadata } from "@/lib/posts";
import { Delete } from "lucide-react";
import { useState, useMemo } from "react";
import Posts from "./Posts";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface Props {
  posts: PostMetadata[];
}

export default function PostsWithSearch({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Unique categories from posts (ignore undefined)
  const categories = useMemo(() => {
    const cats = posts
      .map((post) => post.category)
      .filter((cat): cat is string => typeof cat === "string" && cat.length > 0);
    return Array.from(new Set(cats));
  }, [posts]);

  // Filter posts by search query AND category
  const filtered = posts.filter((post) => {
    const matchesQuery = post.title
      ?.toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory = categoryFilter
      ? post.category === categoryFilter
      : true;

    return matchesQuery && matchesCategory;
  });

  const resetFilters = () => {
    setQuery("");
    setCategoryFilter("");
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Search input + clear button */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={resetFilters}
          disabled={query.length === 0 && categoryFilter === ""}
        >
          Clear <Delete className="ml-2 size-4" />
        </Button>
      </div>

      {/* Category filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={categoryFilter === "" ? "default" : "outline"}
          onClick={() => setCategoryFilter("")}
        >
          All Categories
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={categoryFilter === cat ? "default" : "outline"}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Posts list */}
      <Posts posts={filtered} />
    </div>
  );
}
