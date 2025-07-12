"use client";
import { useState, useEffect, useRef } from "react";
import { usePusherMessages } from "@/hooks/usePusherMessages";

export default function Chat({ conversationId, userId }: { conversationId: string; userId: string }) {
  const [messages, setMessages] = useState<unknown[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  usePusherMessages(conversationId, (msg: unknown) => {
    setMessages((prev) => [...prev, msg]);
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, content: input }),
    });
    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, maxWidth: 400 }}>
      <div style={{ height: 200, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((msg, i) => {
          if (typeof msg === 'object' && msg !== null && 'sender' in msg && 'content' in msg) {
            const m = msg as { sender?: { id?: string; name?: string }; content?: string };
            return (
              <div key={i} style={{ margin: "4px 0", color: m.sender?.id === userId ? "blue" : "black" }}>
                <b>{m.sender?.name || "User"}:</b> {m.content}
              </div>
            );
          }
          return null;
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, marginRight: 8 }}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
} 