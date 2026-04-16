import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured. Add it to your Replit secrets." },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey });

  let body: {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    noteTitle?: string;
    noteContent?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, noteTitle, noteContent } = body;

  const noteContext = noteContent
    ? `\n\nCurrent note title: "${noteTitle || "Untitled"}"\nNote content:\n${stripHtml(noteContent)}`
    : "\n\nNo note is currently open.";

  const systemPrompt =
    `You are SYNT, a private AI assistant embedded in 29NOTES — a personal note-taking vault. ` +
    `You help the user write, think, and organize their notes. ` +
    `Keep responses concise, precise, and useful. ` +
    `When asked to rewrite or generate text, provide only the resulting text — no commentary before or after unless asked. ` +
    `You have access to the currently open note as context.` +
    noteContext;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 900,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
