export async function serverFetch<T>({
  url,
  tags,
  revalidate = 60,
}: {
  url: string;
  tags?: string[];
  revalidate?: number;
}): Promise<T> {
  const res = await fetch(url, {
    next: {
      tags,
      revalidate,
    },
  });

  if (!res.ok) {
    throw new Error("Server fetch failed");
  }

  return res.json();
}
