# Code Practice Playground

Browser-based SQL + C + C# practice platform with guided exercises and classroom management.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run dev:server` | Express backend (port 3001) |
| `npm run dev:all` | Both concurrently |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint (ignores `dist`, `public`, `server`) |

No test framework. No typecheck. Verify: `npm run lint && npm run build`.

## Stack

- **Frontend**: React 19, React Router 6, Vite 8, `.jsx` only (no TS), co-located `.css` (LightningCSS nesting), CodeMirror 6 editors
- **Backend**: Express 5, `sql.js` (SQLite via WASM), JWT auth, `multer` for file uploads
- **Proxy**: Vite proxies `/api` → `localhost:3001`; CORS defaults to `http://localhost:5173`
- **C# compile**: `@wasmsharp/vite-plugin` — .NET WASM + Roslyn in-browser; first load ~10MB

## Architecture

### Frontend routes (`src/main.jsx`)
`ErrorBoundary > AuthProvider > BrowserRouter` wraps all routes.
- `/` → `ModeSelection`
- `/free` → `App` (no language selected)
- `/:lang` or `/:lang/ex/:exId` → `App` → `Playground` (`lang`: sql/c/cs)
- `/student*`, `/teacher*`, `/register` → corresponding classroom components in `src/components/`

### Backend (`server/index.js`)
All mounted under `/api`. Route files in `server/routes/`.
- `/api/auth/*` — `auth.js`
- `/api/classrooms/*` — `classrooms.js`
- `/api/classrooms/:id/assignments`, `/api/assignments/*` — `assignments.js` (includes submissions, grading)
- `/api/classrooms/:id/messages`, `/api/messages/*` — `messages.js`

### Auth
- JWT in `localStorage` key `cp-auth-token`
- `useAuth` hook (`src/hooks/useAuth.jsx`) exposes `authFetch(url, opts)` — prepends `/api`, injects `Authorization`, handles JSON/FormData
- Server: `verifyToken` + `requireRole(role)` in `server/middleware/auth.js`
- `.env` at `server/.env` with `JWT_SECRET` and `PORT`; dev defaults exist

## Key conventions & quirks

### Backend
- **Server must be restarted** after any route/schema change. No `nodemon`.
- **SQL injection is intentional** — raw `${}` string interpolation in all queries. Any new route must match this pattern.
- **Route ordering matters**: in `server/routes/classrooms.js`, static routes (`/my`, `/join`) MUST be before `/:id`.
- `toRows()` helper in `server/db/utils.js` converts `sql.js` results to objects; import it in new route files.
- Schema migrations via `ALTER TABLE` in `try/catch` in `server/db/connection.js`. Current migrations: `starter_files`, `empty_files`, `question_type`, `question_data` on assignments; `assignment_id` on messages; `submissions` table; `score`, `feedback` on submissions.
- DB file `server/data.sqlite` persists. Schema and migrations run every startup (idempotent via try/catch). DB auto-saved every 5s (`setInterval`) and on process exit.
- `server/uploads/` must exist (created by multer on first file upload). Files not cleaned up on assignment delete except via the PUT/DELETE endpoints.
- Email validated server-side with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` on registration.
- Grading endpoint: `PATCH /assignments/:id/submissions/:studentId/grade` — accepts `{ score, feedback }`.
- Rate limiting: auth routes 10 req/15min, API 200 req/min (`server/middleware/rateLimit.js`).
- Request body limit 10mb. Server exits on startup if `JWT_SECRET` is < 16 chars or missing.
- Security headers via `helmet` with CSP (allows `'unsafe-eval'` for WASM, `blob:` for workers, `'unsafe-inline'` styles for CodeMirror).
- File download endpoints (`/assignments/:id/attachment`, `/assignments/:id/starter-files/:filename`, `/assignments/:id`, `/uploads/:filename`) check teacher ownership or student enrollment.
- `DATABASE_PATH`, `SCHEMA_PATH`, and `UPLOADS_DIR` env vars override hardcoded paths.
- Classroom delete cleans up orphaned assignment files from disk.

### Free practice
- Three Web Workers: **SQL** (`src/workers/sqlWorker.js`, ESM), **C** (`public/cWorker.js`, classic `importScripts`), **C#** (`src/workers/csWorker.js`, ESM)
- State via `src/hooks/usePracticeEngine.js` (reducer), persisted to `localStorage` under `code-practice-{language}`, versioned, debounced 1.5s
- Exercises in `src/exercises/{sql,c,cs}.js` export `TOPICS`, `EXERCISES`, `checkCompletion()`
- **Completion is regex pattern-matching on source text** — not functional correctness. Some exercises also check `expectedOutput`/`expectedResults` for exact match.
- Exercises unlock sequentially by `id`; skipping shows confirm dialog. `seedSql` runs automatically when skipping SQL exercises.
- C exercises 41–45 skip compilation (file I/O unsupported in browser). C# 23 & 26 skip (Console.ReadLine unsupported). C# 41–45 compile but filesystem is ephemeral in-memory.
- Workers have execution timeouts: SQL 10s, C 15s, C# 30s compile + 15s run.

### Classroom
- Two roles: `teacher` and `student`. Teachers create classrooms, students join via 6-char code (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- Code hidden from student-facing views.
- File uploads (`.txt`, `.sql`, `.py`, `.cs`, `.c`, `.java`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp`, `.svg`, `.pdf`) stored in `server/uploads/` with `Date.now()-` prefix.
- `starter_files` stored as JSON array string in SQLite.
- Chat uses 5-second polling (no WebSocket).

### ESLint
- Flat config, covers `**/*.{js,jsx}`. Entire `server/` directory is excluded — server-side code is NOT linted.

### Git
- `.gitignore` excludes `server/data.sqlite` and `server/uploads/` (user data).
