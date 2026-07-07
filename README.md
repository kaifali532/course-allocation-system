# AI Powered Student Course Allocation System

A complete enterprise-grade Full Stack web application that automates university course allocation using merit-based ranking, reservation policies, and AI-powered analytics.

## Tech Stack
- **Frontend**: React.js, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, JWT, Prisma ORM.
- **Database**: PostgreSQL.
- **AI Integration**: Google Gemini API (RAG-style Data Querying).

## Architecture & Features
- **Strict Business Logic Execution**: The `Allocation Engine` evaluates merit (marks), resolves ties (application date), enforces strict category quotas, and cascades across up to 3 student preferences atomically.
- **Premium UI**: Uses custom Tailwind glassmorphism, soft shadows, Micro-animations, and modern React principles.
- **AI Assistant**: Natural Language to Data insights using the Gemini API.
- **Reporting**: Dynamic Recharts, Dashboard KPIs, and CSV Export features.

## Setup Instructions

### 1. Database (PostgreSQL)
If you have Docker installed, you can spin up the DB using:
```bash
docker compose up -d
```
Otherwise, ensure you have a running PostgreSQL instance and update the `DATABASE_URL` in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
npm install
# Set environment variables in .env (PORT, JWT_SECRET, DATABASE_URL, GEMINI_API_KEY)
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Monorepo Quick Start
From the root directory:
```bash
npm install
npm run dev
```

## Testing Strategy
The architecture is designed to support comprehensive testing:
1. **Unit Tests (Jest)**: Target `allocationService.ts` to ensure merit rules (Rule 1, 3) and reservation algorithms (Rule 2, 7) work correctly.
2. **Integration Tests (Supertest)**: Validate the Express REST API endpoints (`/students`, `/courses`, `/allocations/run`).
3. **E2E Tests (Cypress/Playwright)**: Mock student application flows, admin dashboard interactions, and AI Assistant queries.

## API Documentation
The backend exposes RESTful endpoints secured by JWT:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/students`
- `POST /api/students`
- `GET /api/courses`
- `POST /api/courses`
- `POST /api/allocations/run`
- `POST /api/allocations/reset`
- `POST /api/ai/ask`
