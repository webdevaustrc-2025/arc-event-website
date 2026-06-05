# AUSTRC Event Website — Knowledge & Handover Skill File

This file acts as a localized project handbook. It contains all the context, architecture patterns, tech stack, directory maps, and design choices for the **AUSTRC Event Website (ARC 3.0)** so that future AI agents or developer sessions can immediately understand the project and build upon it.

---

## 1. Project Goal & Overview

The website is a portal for the **AUSTRC (AUST Robotics Club) Event**. It provides:

- Public pages displaying event info, schedules, segments (e.g. Robo Soccer, Line Follower, Drone Race, Sumo Bot), past events, sponsors, and FAQs.
- A participant registration portal with authentication.
- A user dashboard for viewing registered segments and certificate downloads (future scope).
- A secure admin panel allowing club administrators to manage segments, schedules, sponsors, FAQs, registrations, settings, and users.

---

## 2. Technology Stack

The application is built on the following technologies:

- **Core**: Next.js 16.2.6 (using App Router and Turbopack for fast builds), React 19.2.4, TypeScript.
- **Styling & Animations**: Tailwind CSS v4 (with PostCSS), Framer Motion 12 (for liquid glass animations), and Vanilla CSS.
- **Database & ORM**: Prisma Client v6.19.3 & Prisma ORM connected to a PostgreSQL database hosted on **Neon**.
- **Authentication**: NextAuth.js 4.24.11 (integrating Google OAuth & email/password credentials), with `bcryptjs` for security.
- **Forms & Validation**: Zod for schema validation (both frontend forms and backend API payloads) and React Hook Form.
- **UI Components**: Radix UI primitives integrated with custom premium Glassmorphism styling, and `sonner` for toast notifications.

---

## 3. Database Schema (`prisma/schema.prisma`)

The PostgreSQL database consists of the following key tables:

- **User & Auth**:
  - `User`: Stores user details, email, hashed password, role (`user` vs `admin`), and relationships to sessions/accounts.
  - `Account` & `Session` & `VerificationToken`: Standard models required for NextAuth database adapter.
- **Event Core**:
  - `Segment`: Specific events (e.g., Sumo Bot, Drone Race) with description, rules, prize pools, status (`active`/`inactive`), and images.
  - `Schedule`: Event schedule items containing start/end times, venue, and a relation to `Segment`.
- **Content & Media**:
  - `Sponsor`: Tiered event sponsors (`gold`, `silver`, `bronze`) with logo URLs and website links.
  - `FAQ`: Frequently Asked Questions with questions, answers, and display ordering.
  - `PastEvent`: Historical event list with name, date, description, and images.
- **Transactional & Analytics**:
  - `Registration`: Associates `User` and `Segment` with status (`pending`/`approved`/`rejected`), paymentStatus (`paid`/`unpaid`), and a unique `qrToken`.
  - `Certificate`: PDF/image certificate URLs generated for users for specific segments.
  - `Leaderboard`: Point tracker and rankings.
  - `Setting`: Dynamic key-value pairs for site-wide configuration (e.g., `registration_status = "open"`).

---

## 4. Key Architectural Patterns

### A. The "Dual-Source" Fallback Pattern

To keep the site looking populated and operational even when the database is empty, the application uses a strict dual-source logic:

1. **Public Pages**: Render via Next.js Server Components. They query the PostgreSQL database via Prisma first. If records exist, the page uses them. If no records are found, the page falls back to using the pre-existing, hardcoded dummy/mock arrays.
2. **Admin Pages**: Client Components fetch data from the admin API. If the API returns an empty array, the dashboard or forms display the fallback dummy data.

#### Pattern Example: Public Page (Server Component passing props to Client Component)

```tsx
// src/app/(public)/segments/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import SegmentsPage from "@/components/pages/SegmentsPage";

export default async function Page() {
  const dbSegments = await prisma.segment.findMany({
    where: { status: "active" },
    orderBy: { id: "asc" },
  });
  return <SegmentsPage dbSegments={dbSegments} />;
}
```

```tsx
// src/components/pages/SegmentsPage.tsx (Client Component)
import { FALLBACK_SEGMENTS } from "@/imports/fallback-data";

export default function SegmentsPage({ dbSegments }: { dbSegments?: any[] }) {
  const segments =
    dbSegments && dbSegments.length > 0 ? dbSegments : FALLBACK_SEGMENTS;
  // ... render page using segments array
}
```

### B. Admin Route & API Protection

To protect admin endpoints and pages, helper utilities are used to enforce active administrator sessions:

- **Admin Guard (`src/lib/admin-guard.ts`)**: Exports `requireAdmin()` which runs on the server and checks NextAuth session attributes:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return null;
  }
  return session;
}
```

- **Client-side Fetch Helper (`src/lib/admin-api.ts`)**: Exports `adminFetch()` which handles credentials, content-types, and auto-displays error toasts with `sonner` on response failures.
  Collapse commentComment on lines R79 to R95Copilot commented on Jun 1, 2026 CopilotAIon Jun 1, 2026MediumMore actionsThis section documents src/lib/admin-guard.ts and src/lib/admin-api.ts, but those files don't exist in the repository (and the current admin APIs/pages are protecting routes via direct getServerSession(authOptions) checks). This makes the handover file misleading for future maintainers; please either add the documented helpers or update the documentation to match the actual implementation.Suggested changeset 1 (1)Close review commentSKILL.mdOriginal file line numberDiff line numberDiff line change@@ -77,22 +77,19 @@7777 ``78787979 ### B. Admin Route & API Protection80- To protect admin endpoints and pages, helper utilities are used to enforce active administrator sessions:81- * **Admin Guard (`src/lib/admin-guard.ts`)**: Exports `requireAdmin()` which runs on the server and checks NextAuth session attributes:82- ``typescript83- import { getServerSession } from "next-auth";84- import { authOptions } from "@/app/api/auth/[...nextauth]/route";80+ To protect admin endpoints and pages, server-side session checks are performed using NextAuth.858186- export async function requireAdmin() {87- const session = await getServerSession(authOptions);88- if (!session || session.user?.role !== "admin") {89- return null;90- }91- return session;92- }93- ```94- * **Client-side Fetch Helper (`src/lib/admin-api.ts`)**: Exports `adminFetch()`which handles credentials, content-types, and auto-displays error toasts with`sonner`on response failures.82+ * **Route Handlers**: Admin API routes typically call`getServerSession(authOptions)`and require`session.user?.role === "admin"` before performing any database writes.958384+ Example (Route Handler):85+86+ import { getServerSession } from "next-auth/next";87+ import { authOptions } from "@/app/api/auth/[...nextauth]/route";88+89+ const session = await getServerSession(authOptions);90+ if (!session || session.user?.role !== "admin") {91+ // return 40192+ }9693 ---97949895 ## 5. Design System & Aesthetics (Liquid Glassmorphism)Unable to commit as this autofix suggestion is now outdated.Apply suggestionThis autofix suggestion is outdatedReactPositive feedbackNegative feedbackCopilot uses AI. Check for mistakes.Write a replyResolve comment

---

## 5. Design System & Aesthetics (Liquid Glassmorphism)

The project applies a premium dark-themed aesthetic named **Liquid Glass**, characterized by vibrant green accents and sophisticated transparency.

### Core Visual Guidelines:

- **Hero Section**: Remained **100% sharp and crisp** (NO backdrop blur) with a high-contrast sticky video background.
- **Glass Cards**:
  - Backdrop filter: `blur(12px - 24px) saturate(120% - 180%)`.
  - Background gradients: Dark translucent panels (`rgba(17,17,22,0.7)` to `rgba(26,26,31,0.6)`).
  - Highlights: `inset 0 1px 0 rgba(255,255,255,0.05)` (adds a realistic glass shine on top edges).
  - Borders: Thin, semi-transparent grey/green lines (`rgba(255,255,255,0.08)` or `rgba(88,129,87,0.2)`).
- **Floating Glass Orbs**: Animated SVG/div blobs moving slowly (14s to 25s loops) using Framer Motion. They sit in the background of each section to provide depth.
- **Smart Masking (`src/components/GlassOverlay.tsx`)**: An overlay that clips itself using CSS `clip-path` so that it affects only sections scrolled past the initial hero viewport (below 100vh).

---

## 6. Project Directory Map

- `/prisma`
  - `schema.prisma`: Database definition
  - `seed.js`: Database seeder (creates defaults, FAQs, segments, schedules, and the main Admin user)
- `/src`
  - `/app`: App router paths (Auth endpoints, Admin panel, public/dashboard page wrappers)
  - `/components`: Reusable layout parts, page wrappers, and UI buttons
  - `/hooks`: Custom React hooks (e.g. auth and UI dynamics)
  - `/imports`: Fallback datasets and shared mock data structures
  - `/lib`: Prisma clients, validations schemas (Zod), and admin guard APIs
  - `/styles`: Global CSS (and custom glass CSS utilities)
  - `/types`: TS Type definitions

---

## 7. Local Commands & Dev Lifecycle

- **Dependency Installation** (must bypass peer conflicts with Next.js 16 / React 19):
  `npm install --legacy-peer-deps`
- **Prisma Operations**:
  - Pushing database changes: `npx prisma db push`
  - Generating Client: `npx prisma generate`
  - Database Seeding: `node prisma/seed.js`
- **Development Server**:
  `npm run dev` (starts on port `3000`)
