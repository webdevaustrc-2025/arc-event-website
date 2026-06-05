export async function adminFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({ message: "Unknown error" }));
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
}
