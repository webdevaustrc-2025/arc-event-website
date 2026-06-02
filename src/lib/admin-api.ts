import { toast } from "sonner";

export async function adminFetch<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message || "Something went wrong";
    toast.error(message);
    throw new Error(message);
  }

  return res.json();
}
