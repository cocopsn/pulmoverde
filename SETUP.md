# PulmoVerde — Setup post-rediseño

Esta guía es para terminar el deploy del **bot RAG** (gpt-4o-mini +
embeddings + búsqueda estilo Chroma sobre Supabase) y el **panel admin**.

## 1. Supabase (una sola vez)

1. Abre tu proyecto en https://app.supabase.com → SQL Editor.
2. Pega y ejecuta el contenido de [`supabase/migrations/001_rag_documents.sql`](supabase/migrations/001_rag_documents.sql).
   Esto crea:
   - `rag_documents` — base de conocimiento del bot.
   - `chat_conversations` — log de cada pregunta (analytics).
   - Políticas RLS: lectura pública, escritura solo con service_role.
3. Settings → API → copia el **service_role key** (NO el anon).
   Lo necesitas en Vercel.

## 2. Variables de entorno en Vercel

Project → Settings → Environment Variables. Agrega para
**Production / Preview / Development**:

| Variable                     | Valor                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`             | (la que vive en Kee — `sk-proj-vRhGGYL...`)                                            |
| `SUPABASE_SERVICE_ROLE_KEY`  | el service_role del paso 1                                                             |
| `ADMIN_PASSWORD`             | algo robusto — por defecto en local es `pulmoverde-2026`                               |
| `NEXT_PUBLIC_SUPABASE_URL`   | (ya estaba) `https://yuphpmqhmrtigyfxfstu.supabase.co`                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (ya estaba)                                                                          |

> El `ADMIN_PASSWORD` solo vive en server-side (cookie httpOnly). Cambialo
> por algo serio antes de compartir el panel con el equipo del CBAM.

## 3. Primer deploy

```bash
git push origin master   # Vercel detecta y deploya
```

## 4. Cargar el conocimiento inicial

Después del primer deploy:

1. Visita `https://tu-dominio.vercel.app/admin`
2. Inicia sesión con `ADMIN_PASSWORD`.
3. Ve a la pestaña **Conocimiento (RAG)** → click **Cargar seed**.
   Inserta ~30 documentos con toda la info de la organización, ley,
   calidad del aire, perfiles ICA y compromisos.
4. Cada documento se embebe automáticamente con
   `text-embedding-3-small` (1536 dims).

Después puedes editar / añadir / borrar documentos a mano. Cada cambio
re-genera el embedding. Si rotas el modelo de embeddings, usa
**Re-indexar todo** para refrescar todo el corpus.

## 5. Validar el bot

En la página principal abajo a la derecha aparece **"Pregúntale a
PulmoVerde"**. Pruebas rápidas:

- "¿Cómo denuncio si mi vecino abandonó a su perro?"
- "¿Qué hago si el aire está en 130 y soy embarazada?"
- "¿Quién es el director del CBAM?"

Si el bot responde "no se encontró contexto relevante", el seed no se
cargó. Vuelve al panel admin y carga el seed.

## 6. Costos esperados (gpt-4o-mini)

- ~500 tokens por pregunta promedio
- ~$0.0003 USD por pregunta
- 1,000 preguntas/mes ≈ **$0.30 USD**

El panel admin muestra el costo acumulado en tiempo real.

## 7. Backups y data

- `compromisos`: ya estaban en Supabase. Backup vía Supabase Dashboard →
  Database → Backups (plan Pro) o `pg_dump` manual.
- `rag_documents`: lo mismo. Si quieres exportar el JSON, usa el SQL
  Editor: `select * from rag_documents` → Export CSV.

## Arquitectura del RAG (resumen)

```
Usuario → ChatBot widget → POST /api/chat
                              ↓
             1. Embed pregunta (OpenAI text-embedding-3-small)
             2. Fetch todos los docs de Supabase
             3. Cosine similarity en serverless → top-5 con score >= 0.2
             4. Stuff prompt: SYSTEM + CONTEXTO + PREGUNTA
             5. gpt-4o-mini → respuesta (max 400 tokens, temp 0.3)
             6. Log en chat_conversations
                              ↓
                          Respuesta al usuario con sources
```

Esto es Chroma-style: vector store + similitud + top-K + RAG. Storage es
Supabase porque corre nativo en Vercel serverless sin infra extra. Si
algún día creces a >5,000 documentos, migra `embedding` de `jsonb` a
`vector(1536)` (extensión pgvector) y mueve la similaridad a SQL — el
resto del código no cambia.
