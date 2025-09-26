import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STREAM_API_KEY env var");
}

if (!process.env.STRAEM_API_SECRET_KEY) {
  throw new Error("Missing STRAEM_API_SECRET_KEY env var");
}

export const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY,
  process.env.STRAEM_API_SECRET_KEY
);
