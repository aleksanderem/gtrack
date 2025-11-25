import { ConvexClient } from "convex/browser";

// URL should come from env variables in real app
// For dev, npx convex dev prints the URL, usually stored in .env.local
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://happy-otter-123.convex.cloud"; // Placeholder

export const convex = new ConvexClient(convexUrl);
