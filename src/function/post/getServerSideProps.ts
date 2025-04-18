export async function fetchPosts() {
  try {
    const res = await fetch("http://localhost:3001/api/blog", {
      next: { revalidate: 60 }, // ISR: Refresh every 60s
    });
    const data = await res.json();
    console.log(data)
    return data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
