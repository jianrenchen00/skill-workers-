# Technical Architecture & Implementation Plan

## 1. Technology Stack
- **Frontend/Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase (PostgreSQL, GoTrue)
- **Hosting**: Vercel (recommended) or similar.

## 2. Project Directory Structure (i18n Support)
We will use Next.js Middleware for internationalization, supporting `en` and `zh` locales.
```
uk_chinese_jobs/
├── app/
│   ├── [lang]/             # Dynamic route for localization (en/zh)
│   │   ├── (auth)/         # Auth related routes
│   │   ├── (main)/         # Main layout
│   │   │   ├── page.tsx    # Landing page
│   │   │   ├── jobs/       # Job listing & details
│   │   │   ├── sponsors/   # Sponsor list search
│   │   │   └── dashboard/  # User/Employer dashboard
│   │   └── layout.tsx      # Root layout with LangProvider
│   ├── api/                # API Routes (Language agnostic)
│   │   ├── auth/           # Custom WeChat auth handlers
│   │   ├── cron/           # Scheduled tasks (Visa sync)
│   │   ├── jobs/           # Job CRUD
│   │   └── user/           # User data management (GDPR)
│   ├── middleware.ts       # i18n Middleware (redirects / to /en or /zh)
│   └── i18n/               # Localization config and dictionaries
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── business/           # Business logic components
│   └── layout/             # Header, Footer
├── lib/
│   ├── supabase/           # Supabase client setup
│   ├── wechat/             # WeChat API helpers
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript definitions
└── public/                 # Static assets
```

## 3. Database Schema (Supabase ER Diagram)

### Tables

#### `profiles` (Extends Supabase Auth)
- `id`: uuid (PK, FK to auth.users)
- `wechat_openid`: text (Unique)
- `wechat_unionid`: text (CRITICAL: Required for future WeChat Mini Program integration)
- `role`: text ('seeker' | 'employer' | 'admin')
- `full_name`: text
- `avatar_url`: text
- `created_at`: timestamp

#### `companies`
- `id`: uuid (PK)
- `name`: text
- `website`: text
- `logo_url`: text
- `is_verified_sponsor`: boolean (Computed/Updated via sync)
- `sponsor_license_tier`: text
- `owner_id`: uuid (FK to profiles.id)

#### `visa_sponsors` (Synced from Govt List)
- `id`: uuid (PK)
- `organisation_name`: text
- `town_city`: text
- `county`: text
- `type_rating`: text
- `route`: text
- `last_synced_at`: timestamp
- **Indexes**:
    - `organisation_name`: Full-text Search Index (PGroonga or `tsvector` with `pg_trgm`) for fuzzy matching.

#### `jobs`
- `id`: uuid (PK)
- `company_id`: uuid (FK to companies.id)
- `title_en`: text
- `title_cn`: text
- `description_en`: text
- `description_cn`: text
- `location`: text
- `salary_range`: text
- `is_visa_sponsorship_available`: boolean
- `status`: text ('draft' | 'published' | 'closed')
- `created_at`: timestamp

### Relationships
- `profiles` 1:1 `auth.users`
- `companies` 1:N `jobs`
- `profiles` 1:N `companies`
- `visa_sponsors` is a reference table.

## 4. Key API Routes

### 4.1 WeChat OAuth (`/api/auth/wechat`)
- **GET /login**: Redirects to WeChat QR/Auth page.
- **GET /callback**: Handles WeChat callback code.
    - Exchanges code for `access_token`, `openid`, and `unionid`.
    - Checks if user exists in `profiles` by `unionid` (preferred) or `openid`.
    - Creates/Updates user session.

### 4.2 Visa Sponsor Sync (`/api/cron/sync-sponsors`)
- **Method**: POST (Protected by Cron Secret)
- **Logic**: Fetch CSV, Parse, Batch Upsert.
- **Optimization**: Refresh Full-text index if necessary.

### 4.3 Jobs (`/api/jobs`)
- **GET**: List jobs with filters.
- **POST**: Create new job.

### 4.4 GDPR Data Export (`/api/user/export`)
- **Method**: GET (Protected, User only)
- **Logic**:
    1. Verify user session.
    2. Fetch all data related to user:
        - `auth.users` data
        - `profiles` data
        - `companies` owned by user
        - `jobs` posted by user (if employer)
    3. Return as JSON file download.
    4. Log the export action for audit.

## 5. Implementation Steps
1. **Setup**: Initialize Next.js with i18n routing, Tailwind, Supabase.
2. **Database**: Create tables, RLS policies, and **Full-text search indexes**.
3. **Auth**: Implement WeChat OAuth flow (capturing `unionid`).
4. **Sponsor Sync**: Build parser and sync logic.
5. **Job Board**: Build UI with i18n support (`[lang]` params).
6. **GDPR**: Implement data export endpoint.
