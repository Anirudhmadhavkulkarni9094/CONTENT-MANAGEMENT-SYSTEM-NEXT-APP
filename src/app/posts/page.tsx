import axios from "axios";
import Image from "next/image";
import { Metadata } from "next";
import { FALL_BACK_IMAGE } from "../constants/imageConstant";

interface Post {
  _id: string;
  title: string;
  createdAt: string;
  author?: { name?: string };
  category?: string;
  featuredImage?: string;
}

// 🔄 Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// 🏆 SEO Metadata (Dynamic)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Latest Blogs | My Blog",
    description: "Read the latest blogs on technology, business, and more!",
    openGraph: {
      description: "Explore top articles on tech, business, and lifestyle.",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    // Use absolute URL on the server
    const res = await fetch("https://content-management-system-next-app.vercel.app/api/blog", {
      next: { revalidate: 60 }, // ISR support if needed
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    
    const json = await res.json();
    posts = json.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
  console.log(posts[0].featuredImage)

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
            <p className="text-gray-300">{posts[0].category?.toLocaleUpperCase() || "No summary available."}</p>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
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
                <p className="text-gray-700 mt-2">{post?.category?.toLocaleUpperCase()  || "No summary available."}</p>
                <a
                  href={`/blog/${post._id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
