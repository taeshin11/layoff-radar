export async function trackEvent(event: string, data?: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_WEBHOOK_URL) return;
  fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      lang: document.documentElement.lang || "en",
      ...data,
    }),
  }).catch(() => {});
}
