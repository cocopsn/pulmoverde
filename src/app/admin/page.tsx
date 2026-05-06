"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Lock, LogOut, RefreshCw, Database, Users, MessageSquare,
  Plus, Trash2, Edit2, Save, X, Sparkles, BarChart3, MapPin,
  TrendingUp, DollarSign, Search, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string | null;
  hasEmbedding: boolean;
  created_at: string;
  updated_at: string;
}

interface Stats {
  compromisos: {
    total: number;
    recent: { id: string; nombre: string; colonia: string; acciones: string[]; created_at: string }[];
    byColonia: Record<string, number>;
    byAccion: Record<string, number>;
    last7days: Record<string, number>;
  };
  rag: {
    total: number;
    withEmbedding: number;
    byCategory: Record<string, number>;
  };
  chat: {
    total: number;
    recent: { question: string; answer: string; cost_usd: number; created_at: string; latency_ms: number }[];
    totalCost: number;
  };
}

type Tab = "overview" | "knowledge" | "compromisos" | "chat";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  const [stats, setStats] = useState<Stats | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Document | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const refreshStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    if (res.ok) setStats(data);
  }, []);

  const refreshDocs = useCallback(async () => {
    const res = await fetch("/api/admin/documents");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    if (res.ok) setDocs(data.documents);
  }, []);

  useEffect(() => {
    // Probe auth via stats endpoint.
    (async () => {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      const data = await res.json();
      if (res.ok) setStats(data);
    })();
  }, []);

  useEffect(() => {
    if (authed && tab === "knowledge") refreshDocs();
    if (authed && (tab === "overview" || tab === "compromisos" || tab === "chat")) {
      refreshStats();
    }
  }, [authed, tab, refreshDocs, refreshStats]);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      setPassword("");
    } else {
      const d = await res.json().catch(() => ({}));
      setLoginErr(d.error || "Credenciales incorrectas");
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setStats(null);
    setDocs([]);
  }

  async function saveDoc(doc: Partial<Document>) {
    setBusy(true);
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    setBusy(false);
    if (res.ok) {
      flash("ok", `Documento ${doc.id ? "actualizado" : "creado"} y re-embebido.`);
      setEditing(null);
      setCreating(false);
      refreshDocs();
    } else {
      const d = await res.json().catch(() => ({}));
      flash("err", d.error || "Error al guardar");
    }
  }

  async function deleteDoc(id: string) {
    if (!confirm("¿Eliminar este documento? No se puede deshacer.")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/documents?id=${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      flash("ok", "Documento eliminado.");
      refreshDocs();
    } else {
      flash("err", "Error al eliminar");
    }
  }

  async function reindex(seed: boolean) {
    setBusy(true);
    const res = await fetch("/api/admin/reindex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    });
    setBusy(false);
    const data = await res.json();
    if (res.ok) {
      if (seed) {
        flash("ok", `Seed completo: ${data.seeded} insertados (total ${data.total_after}).`);
      } else {
        flash("ok", `Re-indexado: ${data.reindexed} documentos.`);
      }
      refreshDocs();
      refreshStats();
    } else {
      flash("err", data.error || "Error en reindex");
    }
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-[#2D6A4F] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-md bg-surface rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-5 mx-auto">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-primary text-center mb-1">
            Panel administrativo
          </h1>
          <p className="text-center text-muted text-sm mb-6">
            PulmoVerde · acceso interno CBAM
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-secondary bg-white text-text-dark placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {loginErr && (
            <p className="mt-3 text-sm text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {loginErr}
            </p>
          )}
          <button
            type="submit"
            className="w-full mt-5 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const filteredDocs = docs.filter(
    (d) =>
      filter.length === 0 ||
      d.title.toLowerCase().includes(filter.toLowerCase()) ||
      d.content.toLowerCase().includes(filter.toLowerCase()) ||
      d.category.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Top bar */}
      <header className="bg-white border-b border-secondary/40 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] font-semibold text-primary leading-tight">
                PulmoVerde Admin
              </p>
              <p className="text-xs text-muted">
                Gestión de conocimiento y métricas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-sm text-muted hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-all"
            >
              Ver sitio
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-muted hover:text-danger px-3 py-2 rounded-lg hover:bg-danger/5 transition-all"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Vista general", icon: BarChart3 },
            { id: "knowledge", label: "Conocimiento (RAG)", icon: Database },
            { id: "compromisos", label: "Compromisos", icon: Users },
            { id: "chat", label: "Conversaciones", icon: MessageSquare },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-primary"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </header>

      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
            toast.type === "ok"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
        >
          {toast.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {tab === "overview" && stats && <Overview stats={stats} />}
        {tab === "knowledge" && (
          <Knowledge
            docs={filteredDocs}
            totalDocs={docs.length}
            filter={filter}
            setFilter={setFilter}
            onCreate={() => {
              setCreating(true);
              setEditing({
                id: "",
                title: "",
                content: "",
                category: "general",
                source: "",
                hasEmbedding: false,
                created_at: "",
                updated_at: "",
              });
            }}
            onEdit={(d) => setEditing(d)}
            onDelete={deleteDoc}
            onReindex={() => reindex(false)}
            onSeed={() => reindex(true)}
            busy={busy}
          />
        )}
        {tab === "compromisos" && stats && <Compromisos stats={stats} />}
        {tab === "chat" && stats && <ChatLog stats={stats} />}
      </main>

      {editing && (
        <DocEditor
          doc={editing}
          isNew={creating}
          busy={busy}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={saveDoc}
        />
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string | number; hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-secondary/40 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <Icon className="w-4 h-4 text-primary/60" />
      </div>
      <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-primary leading-none">
        {value}
      </p>
      {hint && <p className="text-xs text-muted mt-2">{hint}</p>}
    </div>
  );
}

function Overview({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Compromisos firmados"
          value={stats.compromisos.total}
          hint={`${Object.keys(stats.compromisos.byColonia).length} colonias activas`}
        />
        <MetricCard
          icon={Database}
          label="Documentos en RAG"
          value={stats.rag.total}
          hint={`${stats.rag.withEmbedding} con embedding`}
        />
        <MetricCard
          icon={MessageSquare}
          label="Conversaciones del bot"
          value={stats.chat.total}
        />
        <MetricCard
          icon={DollarSign}
          label="Costo OpenAI acumulado"
          value={`$${stats.chat.totalCost.toFixed(4)}`}
          hint="USD · gpt-4o-mini"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-secondary/40 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Compromisos últimos 7 días
          </h3>
          <Last7DaysChart data={stats.compromisos.last7days} />
        </div>
        <div className="bg-white rounded-2xl border border-secondary/40 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" /> Conocimiento por categoría
          </h3>
          <CategoryBreakdown data={stats.rag.byCategory} />
        </div>
      </div>
    </div>
  );
}

function Last7DaysChart({ data }: { data: Record<string, number> }) {
  const days: { day: string; count: number; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    days.push({
      day: key,
      count: data[key] || 0,
      label: d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" }),
    });
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-40">
      {days.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full bg-gradient-to-t from-primary to-success rounded-t-md min-h-[2px]"
              style={{ height: `${(d.count / max) * 100}%` }}
              title={`${d.count} compromisos`}
            />
          </div>
          <p className="text-[10px] text-muted text-center leading-tight">
            {d.label}
            <br />
            <span className="font-semibold text-text-dark">{d.count}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function CategoryBreakdown({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, n]) => s + n, 0);
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        Sin documentos. Inicia con &quot;Cargar seed&quot;.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {entries.map(([cat, n]) => (
        <div key={cat}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-dark capitalize">{cat}</span>
            <span className="text-muted">{n}</span>
          </div>
          <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(n / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Knowledge({
  docs, totalDocs, filter, setFilter, onCreate, onEdit, onDelete, onReindex,
  onSeed, busy,
}: {
  docs: Document[]; totalDocs: number; filter: string; setFilter: (s: string) => void;
  onCreate: () => void; onEdit: (d: Document) => void; onDelete: (id: string) => void;
  onReindex: () => void; onSeed: () => void; busy: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-secondary/40 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-primary">
              Base de conocimiento
            </h2>
            <p className="text-sm text-muted mt-1">
              {totalDocs} documentos indexados · vector store estilo Chroma sobre
              Supabase · embeddings text-embedding-3-small (1536d)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onSeed}
              disabled={busy}
              className="flex items-center gap-2 text-sm bg-secondary/60 text-primary px-4 py-2 rounded-xl hover:bg-secondary disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Cargar seed
            </button>
            <button
              onClick={onReindex}
              disabled={busy}
              className="flex items-center gap-2 text-sm bg-secondary/60 text-primary px-4 py-2 rounded-xl hover:bg-secondary disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />{" "}
              Re-indexar todo
            </button>
            <button
              onClick={onCreate}
              disabled={busy}
              className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Plus className="w-4 h-4" /> Nuevo documento
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar por título, contenido o categoría…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-secondary bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {docs.length === 0 && totalDocs === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-secondary p-12 text-center">
          <Database className="w-10 h-10 text-muted/40 mx-auto mb-3" />
          <p className="text-text-dark font-medium mb-1">
            No hay documentos indexados todavía.
          </p>
          <p className="text-sm text-muted mb-5">
            Carga el seed inicial con la información de PulmoVerde, la Ley y la
            calidad del aire.
          </p>
          <button
            onClick={onSeed}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Cargar seed inicial
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-2xl border border-secondary/40 p-5 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-medium text-text-dark leading-snug">{d.title}</h3>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(d)}
                  className="text-muted hover:text-primary p-1"
                  aria-label="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(d.id)}
                  className="text-muted hover:text-danger p-1"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                {d.category}
              </span>
              {d.hasEmbedding ? (
                <span className="text-[10px] text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> indexado
                </span>
              ) : (
                <span className="text-[10px] text-warning flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> sin embedding
                </span>
              )}
            </div>
            <p className="text-sm text-muted line-clamp-3 leading-relaxed">
              {d.content}
            </p>
            {d.source && (
              <p className="text-[11px] text-muted/70 mt-3 italic">
                Fuente: {d.source}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocEditor({
  doc, isNew, busy, onCancel, onSave,
}: {
  doc: Document; isNew: boolean; busy: boolean;
  onCancel: () => void;
  onSave: (d: Partial<Document>) => void;
}) {
  const [form, setForm] = useState({
    id: doc.id,
    title: doc.title,
    content: doc.content,
    category: doc.category,
    source: doc.source || "",
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onCancel}
    >
      <div
        className="bg-surface rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-secondary/40 sticky top-0 bg-surface flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-primary">
            {isNew ? "Nuevo documento" : "Editar documento"}
          </h3>
          <button onClick={onCancel} className="text-muted hover:text-text-dark">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Título
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-secondary bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {["organizacion", "ley", "aire", "compromisos", "colonias", "general"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">
                Fuente (opcional)
              </label>
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="ej. SIMA Coahuila"
                className="w-full px-4 py-2.5 rounded-xl border border-secondary bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Contenido
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-secondary bg-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-muted mt-1.5">
              {form.content.length} caracteres · al guardar se re-genera el
              embedding automáticamente.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-secondary/40 bg-white sticky bottom-0 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted hover:text-text-dark"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              onSave({
                ...(isNew ? {} : { id: form.id }),
                title: form.title,
                content: form.content,
                category: form.category,
                source: form.source || undefined,
              })
            }
            disabled={busy || !form.title || !form.content}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}{" "}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Compromisos({ stats }: { stats: Stats }) {
  const colonias = Object.entries(stats.compromisos.byColonia).sort(
    (a, b) => b[1] - a[1],
  );
  const acciones = Object.entries(stats.compromisos.byAccion).sort(
    (a, b) => b[1] - a[1],
  );
  const accionLabels: Record<string, string> = {
    esterilizar: "Esterilizar mascota",
    no_quemar: "No quemar basura",
    afinar: "Afinar vehículo",
    adoptar: "Adoptar (no comprar)",
    reportar: "Reportar ladrilleras",
    transporte: "Reducir auto",
    residuos: "Separar residuos",
    difundir: "Difundir Ley",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard icon={Users} label="Total firmas" value={stats.compromisos.total} />
        <MetricCard
          icon={MapPin}
          label="Colonias activas"
          value={Object.keys(stats.compromisos.byColonia).length}
        />
        <MetricCard
          icon={TrendingUp}
          label="Acción más popular"
          value={acciones[0] ? accionLabels[acciones[0][0]] || acciones[0][0] : "—"}
          hint={acciones[0] ? `${acciones[0][1]} personas` : ""}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-secondary/40 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4">
            Top colonias
          </h3>
          <div className="space-y-3">
            {colonias.slice(0, 10).map(([col, n]) => {
              const pct = (n / stats.compromisos.total) * 100;
              return (
                <div key={col}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-dark">{col}</span>
                    <span className="text-muted">{n}</span>
                  </div>
                  <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {colonias.length === 0 && (
              <p className="text-sm text-muted text-center py-6">
                Aún no hay compromisos firmados.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-secondary/40 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4">
            Acciones más firmadas
          </h3>
          <div className="space-y-3">
            {acciones.map(([id, n]) => {
              const pct = (n / Math.max(1, stats.compromisos.total)) * 100;
              return (
                <div key={id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-dark">{accionLabels[id] || id}</span>
                    <span className="text-muted">{n}</span>
                  </div>
                  <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {acciones.length === 0 && (
              <p className="text-sm text-muted text-center py-6">
                Sin datos.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-secondary/40 p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4">
          Firmas recientes
        </h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-secondary/40">
                <th className="py-2 pr-3">Fecha</th>
                <th className="py-2 pr-3">Nombre</th>
                <th className="py-2 pr-3">Colonia</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stats.compromisos.recent.map((c) => (
                <tr key={c.id} className="border-b border-secondary/20">
                  <td className="py-2 pr-3 text-muted whitespace-nowrap text-xs">
                    {new Date(c.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="py-2 pr-3 font-medium">{c.nombre}</td>
                  <td className="py-2 pr-3 text-muted">{c.colonia}</td>
                  <td className="py-2 text-xs text-primary">
                    {c.acciones.map((a) => accionLabels[a] || a).join(", ")}
                  </td>
                </tr>
              ))}
              {stats.compromisos.recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted">
                    Sin firmas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChatLog({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={MessageSquare}
          label="Conversaciones totales"
          value={stats.chat.total}
        />
        <MetricCard
          icon={DollarSign}
          label="Costo OpenAI"
          value={`$${stats.chat.totalCost.toFixed(4)}`}
          hint="USD acumulado"
        />
        <MetricCard
          icon={TrendingUp}
          label="Latencia promedio"
          value={
            stats.chat.recent.length > 0
              ? `${Math.round(
                  stats.chat.recent.reduce((s, c) => s + c.latency_ms, 0) /
                    stats.chat.recent.length,
                )}ms`
              : "—"
          }
        />
      </div>

      <div className="bg-white rounded-2xl border border-secondary/40 p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-primary mb-4">
          Últimas 20 preguntas
        </h3>
        <div className="space-y-4">
          {stats.chat.recent.map((c, i) => (
            <div
              key={i}
              className="border border-secondary/40 rounded-xl p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-medium text-text-dark text-sm">{c.question}</p>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {new Date(c.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">
                {c.answer}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted">
                <span>${Number(c.cost_usd || 0).toFixed(5)}</span>
                <span>{c.latency_ms}ms</span>
              </div>
            </div>
          ))}
          {stats.chat.recent.length === 0 && (
            <p className="text-sm text-muted text-center py-8">
              No hay conversaciones todavía.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
