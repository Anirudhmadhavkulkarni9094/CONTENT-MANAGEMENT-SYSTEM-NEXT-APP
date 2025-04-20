"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FALL_BACK_IMAGE } from "./constants/imageConstant";

interface Post {
  _id: string;
  slug: string;
  title: string;
  createdAt: string;
  author?: { name?: string };
  category: string;
  featuredImage?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const json = await res.json();
      setPosts(json.data);
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string, categoty:string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(slug);

    try {
      const res = await fetch(`/api/blog/${categoty}/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      // Remove deleted post from state
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      {posts.length > 0 && (
        <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            width={800}
            height={400}
            src={posts[0]?.featuredImage || FALL_BACK_IMAGE}
            alt="Featured Blog"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
            <h1 className="text-3xl font-bold">{posts[0].title}</h1>
            <p className="text-gray-300">
              {posts[0].category?.toLocaleUpperCase() || "No summary available."}
            </p>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <p className="text-red-500 col-span-full text-center">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No posts found.</p>
        ) : (
          posts.map((post: Post) => (
            <div
              key={post._id}
              className="border rounded-lg overflow-hidden shadow-md transition hover:shadow-lg bg-white"
            >
              <div className="p-4">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  by {post?.author?.name || "Anirudh Kulkarni"}
                </p>
                <p className="text-gray-700 mt-2">
                  {post?.category?.toLocaleUpperCase() || "No summary available."}
                </p>
                <a
                  href={`/blog/${post._id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  Read More →
                </a>

                {/* Edit & Delete Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/blog/edit/${post._id}`)}
                    title={"Coming soon"}
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded disabled cursor-not-allowed"
                    disabled={true}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug, post.category)}
                    disabled={deletingId === post._id}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    {deletingId === post._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
