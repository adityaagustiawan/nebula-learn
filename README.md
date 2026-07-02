# NebulaLearn

> **Live Site:** https://nebulalearn-umber.vercel.app/

An all-in-one learning platform with courses, competitions, live webinars, cloud drive, project showcase, and a talent hub with skill verification, leaderboard, rewards, and AI recommendations.

---

## Features

- **Structured Learning Paths** — Curated courses from beginner to pro across AI, cybersecurity, data, cloud, and web dev
- **Hackathons & Competitions** — Compete with prizes and leaderboards
- **Live Webinars** — Weekly sessions with industry mentors, Q&A, and replays
- **Cloud Drive** — Store your project files securely with real-time sync
- **Project Showcase** — Display your GitHub projects publicly
- **Skill Wallet** — Track your progress and achievements with verification
- **Talent Hub** — Submit skills, portfolios, and certificates for admin verification
- **Leaderboard** — Rank students by verified points
- **Rewards System** — Redeem points for rewards
- **AI Recommendations** — Personalized suggestions to grow your talent
- **Admin Dashboard** — Manage verifications, rewards, students, and opportunities

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TanStack Router + TanStack Start |
| Styling | Tailwind CSS 4 + Framer Motion |
| UI Components | Radix UI + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Deployment | Vercel (production) + Docker (local/self-hosted) |

---

## System Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        A[React 19 App] --> B[TanStack Router]
        A --> C[TanStack Query]
        A --> D[Framer Motion]
        A --> E[Tailwind CSS]
    end

    subgraph "Vercel Edge Network"
        F[CDN] --> G[Nitro Server]
        G --> H[SSR Rendering]
    end

    subgraph "Supabase Platform"
        J[Auth Service]
        K[PostgreSQL Database]
        L[Storage Service]
        M[Realtime Service]
    end

    subgraph "External Services"
        N[GitHub API]
        O[Google OAuth]
    end

    B --> F
    C --> J
    C --> K
    C --> L
    C --> M
    A --> N
    J --> O
```

---

## Authentication Flow

```mermaid
flowchart TD
    A[User mengakses /login] --> B{Punya akun?}
    B -->|Ya| C[Tab Sign In]
    B -->|Tidak| D[Tab Sign Up]
    B -->|Google| E[Continue with Google]

    C --> F[Input Email + Password]
    D --> G[Input Full Name + Email + Password]
    E --> H[Google OAuth Redirect]

    F --> I[supabase.auth.signInWithPassword]
    G --> J[supabase.auth.signUp]
    H --> K[supabase.auth.signInWithOAuth]

    I --> L{Berhasil?}
    J --> M{Berhasil?}
    K --> N{Berhasil?}

    L -->|Ya| O[Redirect ke /dashboard]
    L -->|Tidak| P[Toast Error]
    M -->|Ya| Q[Check email verifikasi]
    M -->|Tidak| P
    N -->|Ya| O
    N -->|Tidak| P
```

---

## Points & Verification Flow

```mermaid
flowchart LR
    A[Skill Approved] -->|+1 pt| D[points_transactions]
    B[Portfolio Approved] -->|+2/+5/+8 pts| D
    C[Certificate Approved] -->|+1/+3/+5/+10 pts| D

    D --> E[Trigger: update_user_total_points]
    E --> F[SUM all points]
    F --> G[UPDATE profiles.total_points]

    G --> H[Leaderboard Update]
    G --> I[Reward Eligibility]
    G --> J[AI Recommendations]
```

---

## Admin Verification Flow

```mermaid
flowchart TD
    A[Mahasiswa submit skill/portfolio/certificate] --> B[Status = pending]
    B --> C[Admin buka /admin/verification]
    C --> D[Review detail + evidence URL]
    D --> E{Keputusan}

    E -->|Approve| F[Update status = approved]
    F --> G[Insert points_transactions]
    G --> H[Trigger auto-update total_points]
    H --> I[Toast: Approved]

    E -->|Reject| J[Update status = rejected]
    J --> K[Optional review note]
    K --> L[Toast: Rejected]
```

---

## Reward Claim Flow

```mermaid
flowchart TD
    A[Mahasiswa buka /talent/rewards] --> B[System ambil active rewards]
    B --> C[System ambil profile.total_points]
    C --> D[System ambil reward_claims]

    D --> E{Sudah claim?}
    E -->|Ya| F[Badge: Claimed]
    E -->|Tidak| G{Poin cukup?}

    G -->|Ya| H[Tombol Claim aktif]
    G -->|Tidak| I[Tombol: Need X more pts]

    H --> J[User klik Claim]
    J --> K[Insert reward_claims]
    K --> L[Badge: Claimed]
```

---

## Database Schema

```mermaid
erDiagram
    profiles {
        uuid id PK
        text full_name
        text email
        text role
        text major
        int total_points
    }

    skills {
        uuid id PK
        uuid user_id FK
        text skill_name
        text evidence_url
        text status
        int points
    }

    portfolios {
        uuid id PK
        uuid user_id FK
        text type
        text title
        text status
        int points
    }

    certificates {
        uuid id PK
        uuid user_id FK
        text level
        text title
        text status
        int points
    }

    points_transactions {
        uuid id PK
        uuid user_id FK
        text source_type
        int points
    }

    rewards {
        uuid id PK
        text name
        int required_points
        boolean is_active
    }

    reward_claims {
        uuid id PK
        uuid user_id FK
        uuid reward_id FK
        text status
    }

    courses {
        uuid id PK
        text slug
        text title
        text category
        text level
    }

    enrollments {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        numeric progress_percent
    }

    profiles ||--o{ skills : "has"
    profiles ||--o{ portfolios : "has"
    profiles ||--o{ certificates : "has"
    profiles ||--o{ points_transactions : "earns"
    profiles ||--o{ reward_claims : "claims"
    profiles ||--o{ enrollments : "enrolls"
    rewards ||--o{ reward_claims : "claimed_by"
    courses ||--o{ enrollments : "has"
```

---

## Points Reference

| Type | Sub-type | Points |
|---|---|---|
| Skill | Any | +1 |
| Portfolio | Personal | +2 |
| Portfolio | Freelance | +5 |
| Portfolio | Industri | +8 |
| Certificate | Local | +1 |
| Certificate | Regional | +3 |
| Certificate | Nasional | +5 |
| Certificate | Internasional | +10 |

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/adityaagustiawan/nebula-learn.git
cd nebula-learn
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

### Development

```bash
bun run dev
```

Visit [https://nebulalearn-umber.vercel.app/](https://nebulalearn-umber.vercel.app/) for the live site.

### Build

```bash
bun run build
```

### Docker

```bash
cp .env.example .env
docker compose up --build
# Open http://localhost:3000
```

---

## Project Structure

```
├── Dockerfile               # Docker build (Node 20 Alpine + Bun)
├── docker-compose.yml       # Docker Compose config
├── src/
│   ├── components/          # UI and feature components
│   │   ├── learning/        # LiveFeed, platform-bootstrap
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React contexts (theme, realtime)
│   ├── hooks/               # Custom hooks (auth, learning, live-catalog)
│   ├── integrations/        # Supabase client
│   ├── lib/                 # Utilities and types
│   ├── routes/              # Page routes (TanStack Router file-based)
│   │   ├── admin/           # Admin dashboard, students, verification, rewards
│   │   └── talent/          # Student hub: skills, portfolios, leaderboard, rewards, AI recs
│   └── styles.css           # Global styles and theme
└── supabase/
    └── migrations/          # Database schema (SQL)
```

---

## All Pages/Routes

| Route | Description | Role |
|---|---|---|
| `/` | Homepage / Landing Page | Public |
| `/login` | Login & Sign Up | Public |
| `/dashboard` | User Dashboard | User |
| `/courses` | Course Listing | User |
| `/courses/:slug` | Course Detail | User |
| `/competitions` | Competitions / Hackathons | User |
| `/webinars` | Live Webinars | User |
| `/projects` | Project Showcase | User |
| `/drive` | Cloud Drive | User |
| `/talent` | Talent Hub | User |
| `/talent/profile` | Edit Profile | User |
| `/talent/skills` | Skill Management | User |
| `/talent/portfolios` | Portfolio Management | User |
| `/talent/certificates` | Certificate Management | User |
| `/talent/leaderboard` | Leaderboard | User |
| `/talent/rewards` | Reward Catalog & Claim | User |
| `/talent/recommendations` | AI Recommendations | User |
| `/talent/opportunities` | Opportunities | User |
| `/admin` | Admin Dashboard | Admin |
| `/admin/students` | Student Management | Admin |
| `/admin/verification` | Verification Queue | Admin |
| `/admin/rewards` | Reward Management | Admin |
| `/admin/opportunities` | Opportunity Management | Admin |

---

## Roles

| Role | Access |
|---|---|
| **Admin** | Dashboard, student management, verification queue, reward management, opportunity management |
| **Mahasiswa** | Dashboard, talent hub (skills, portfolios, certificates), leaderboard, rewards, AI recommendations, cloud drive |

---

## Deployment

### Vercel (Production)

Live at: https://nebulalearn-umber.vercel.app/

### Docker (Local)

```bash
docker compose up --build
```

---

## Credits

- **Nama**: Adytia Agustiawan
- **NIM**: 25.60.0209
- **Program Studi**: Bachelor of Information Technology
- **Universitas**: Universitas Amikom Yogyakarta

## License

MIT
