# VedaAI - AI Assessment Creator

Full-stack implementation of the VedaAI hiring assignment based on the provided Figma flows.

## Overview

This project lets a teacher:

- create an assignment
- generate a question paper using AI
- view the generated output in a structured exam-paper layout

## Live Links

- Frontend: https://vedaai-assessment-monorepo-web.vercel.app/
- Backend API: https://vedaai-api-5opp.onrender.com
- Health Check: https://vedaai-api-5opp.onrender.com/health
- Product Demo (Loom): https://www.loom.com/share/9e31d87570da4f32942b8257a9c83152

## Requirements Coverage

### 1. Assignment Creation (Frontend)

- [x] File upload (`PDF` / `TXT`, optional, max `10MB`)
- [x] Due date input
- [x] Question type selection
- [x] Number of questions and marks configuration
- [x] Additional instructions input
- [x] Validation on both frontend and backend (no empty or negative values)
- [x] Redux Toolkit state management
- [x] WebSocket integration for live generation status

### 2. AI Question Generation

- [x] Input transformed into a structured prompt
- [x] Structured output generated as sections with:
  - section title/instruction
  - question text
  - difficulty (`easy` / `medium` / `hard`)
  - marks
- [x] Raw LLM text is not rendered directly
- [x] JSON schema + zod validation + fallback generation path

### 3. Backend System

- [x] Node.js + Express + TypeScript
- [x] MongoDB for assignments and generated papers
- [x] Redis for short-lived job status cache
- [x] BullMQ queues/workers for generation and PDF jobs
- [x] WebSocket status updates to frontend
- [x] Assignment delete cleanup:
  - removes assignment + generated paper records
  - removes linked uploaded source file and generated PDF file from local storage

### 4. Output Page

- [x] Student info block
- [x] Grouped question sections (A/B/...)
- [x] Difficulty labels and marks per question
- [x] Regenerate action
- [x] Download as PDF action
- [x] Mobile responsive layout

## Tech Stack

- Frontend: Next.js 16, TypeScript, Redux Toolkit, Socket.IO client, Tailwind CSS
- Backend: Node.js, Express 5, TypeScript, MongoDB (Mongoose), Redis, BullMQ, Socket.IO
- PDF generation: `pdfkit`
- Monorepo: Turborepo + pnpm workspaces

## Monorepo Structure

- `apps/web`: teacher-facing frontend
- `apps/api`: API server, workers, websocket server
- `packages/*`: shared workspace configuration

## Architecture Flow

1. Teacher submits assignment from `/assignments/create`.
2. Frontend sends multipart data to `POST /api/assignments`.
3. Frontend starts generation with `POST /api/assignments/:id/generate`.
4. Backend enqueues BullMQ generation job.
5. Generation worker:
   - marks assignment as `processing`
   - builds AI prompt and requests structured output
   - validates/parses response
   - stores generated paper in MongoDB
   - marks assignment as `completed`
   - enqueues PDF job
6. PDF worker renders and stores PDF, updates paper `pdf.status`.
7. Backend emits `assignment:status` events via WebSocket.
8. Frontend listens for status updates and refreshes paper data.

## API Endpoints

- `GET /health`
- `GET /api/assignments`
- `POST /api/assignments`
- `GET /api/assignments/:id`
- `DELETE /api/assignments/:id`
- `POST /api/assignments/:id/generate`
- `GET /api/assignments/:id/status`
- `GET /api/generated-papers/assignment/:assignmentId`
- `GET /api/generated-papers/assignment/:assignmentId/pdf`

## Environment Variables

### `apps/api/.env`

```bash
PORT=4000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
NODE_ENV=development
```

### `apps/web/.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

Starter files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

PowerShell:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

## Local Setup

```bash
pnpm install
pnpm dev
```

This starts both `web` and `api` via the monorepo dev runner.

## Useful Commands

```bash
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter web check-types
pnpm --filter web lint
pnpm --filter web build
pnpm --filter api build
pnpm verify:deploy
```

## Storage Cleanup (One-Time Orphan Cleanup)

When running many local iterations, orphan files can accumulate in:

- `apps/api/storage/uploads`
- `apps/api/storage/exports`

Cleanup script compares files on disk against MongoDB references.

1. Build API:

```bash
pnpm --filter api build
```

2. Dry run:

```bash
pnpm --filter api cleanup:storage:dry-run
```

3. Execute deletion:

```bash
pnpm --filter api cleanup:storage:execute
```

## Deployment

1. API
- Build: `pnpm --filter api build`
- Start: `pnpm --filter api start`
- Required env: `PORT`, `FRONTEND_URL`, `MONGODB_URI`, `REDIS_URL`, `GROQ_API_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `NODE_ENV`

2. Web
- Build: `pnpm --filter web build`
- Start: `pnpm --filter web start`
- Required env: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_WS_URL` must point to deployed API origin

3. Pre-deploy gate
- Run `pnpm verify:deploy`
- Runs lint + typecheck + production builds

## Notes

- `groups`, `library`, `toolkit`, and `settings` routes are currently placeholder modules with "in progress" screens.
- Local MongoDB data can be inspected in Compass using `mongodb://localhost:27017/vedaai`.
- Build uses `next/font/google` for some fonts; deployment environment should allow outbound access to Google Fonts at build time.

## Submission Checklist

- [x] Full-stack assignment flow (create -> generate -> view)
- [x] BullMQ background jobs (generation + PDF)
- [x] WebSocket realtime updates
- [x] Structured question paper rendering
- [x] PDF endpoint and download flow
- [x] Assignment delete cleanup for linked storage files
- [x] Setup and architecture documentation
