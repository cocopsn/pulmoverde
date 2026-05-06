"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Leaf, Sparkles } from "lucide-react";

interface Source {
  id: string;
  title: string;
  category: string;
  score: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGGESTED = [
  "¿Cómo denuncio maltrato animal?",
  "¿Qué hago si el aire está mal y soy asmático?",
  "¿Qué dice la ley si abandonan a un perro?",
  "¿Cuáles son las fuentes del PM2.5 en Saltillo?",
];

const SESSION_KEY = "pv_chat_session";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) setSessionId(existing);
    else {
      const id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
      setSessionId(id);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Lo siento, hubo un error: ${data.error || "desconocido"}`,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer, sources: data.sources },
        ]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error de red: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat"
          className="fixed bottom-6 right-6 z-[60] group"
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 blur-xl group-hover:bg-primary/40 transition-all" />
          <span className="relative flex items-center gap-2 bg-primary text-white px-5 py-4 rounded-full shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/40 transition-all">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm hidden sm:inline">
              Pregúntale a PulmoVerde
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[420px] h-[100dvh] sm:h-[640px] sm:max-h-[80vh]">
          <div className="flex flex-col h-full bg-surface sm:rounded-3xl shadow-2xl border border-secondary/40 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-primary/90 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] font-semibold leading-tight">
                    Asistente PulmoVerde
                  </p>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full" />
                    En línea · responde en segundos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-6 space-y-4"
            >
              {messages.length === 0 && (
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-secondary/40 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-text-dark leading-relaxed max-w-[85%]">
                      <p>
                        Hola, soy el asistente de PulmoVerde. Pregúntame sobre la{" "}
                        <strong>Ley de Seres Sintientes</strong>, la{" "}
                        <strong>calidad del aire en Saltillo</strong>, cómo{" "}
                        <strong>denunciar maltrato animal</strong> o cómo firmar tu
                        compromiso ciudadano.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted px-1">
                      Preguntas frecuentes
                    </p>
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        disabled={loading}
                        className="block w-full text-left text-sm bg-white border border-secondary/60 rounded-xl px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] ${
                      m.role === "user" ? "ml-auto" : ""
                    }`}
                  >
                    <div
                      className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                          : "bg-secondary/40 text-text-dark rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.sources.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            title={`relevancia ${(s.score * 100).toFixed(0)}%`}
                            className="text-[10px] uppercase tracking-wider bg-primary/5 text-primary px-2 py-1 rounded-full border border-primary/10"
                          >
                            {s.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary/40 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted">pensando…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-secondary/40 px-4 py-3 bg-white"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Escribe tu pregunta…"
                  className="flex-1 resize-none px-4 py-3 rounded-2xl border border-secondary bg-surface text-sm text-text-dark placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-h-32"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar"
                  className="bg-primary text-white p-3 rounded-2xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted/70 mt-2 text-center">
                Powered by RAG · gpt-4o-mini · respuestas basadas solo en datos
                indexados
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
