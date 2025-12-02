# Product Requirements Document (PRD) - UK Chinese Jobs Platform

## 1. Project Overview
**Goal**: Build a job board platform specifically tailored for Chinese job seekers in the UK, focusing on visa sponsorship opportunities and seamless WeChat integration.
**Target Audience**:
- **Job Seekers**: Chinese speakers in the UK (students, professionals) looking for Tier 2 (Skilled Worker) visa sponsorship jobs.
- **Employers**: UK companies looking to hire Chinese-speaking talent.

## 2. Core Features

### 2.1 WeChat Service Account OAuth Login
- **Description**: Users can log in using their WeChat account via a Service Account (服务号).
- **Flow**:
    1. User clicks "Login with WeChat".
    2. PC: Shows a QR code (generated via WeChat Open Platform or Service Account API).
    3. Mobile: Redirects to WeChat authorization page.
    4. System captures `openid` and `unionid` (if available) to create/match user account.
- **Requirement**: Must handle token refresh and user session management (Supabase Auth + Custom Provider or Custom Logic).

### 2.2 UK Tier 2 Visa Sponsor List Sync
- **Description**: Automatically synchronize the official "Register of licensed sponsors: workers" from the UK Home Office.
- **Functionality**:
    - **Auto-Sync**: Scheduled cron job (e.g., daily/weekly) to fetch the CSV/PDF from the official government URL.
    - **Parsing**: Parse the file and update the `visa_sponsors` database table.
    - **Search**: Users can search if a company is a licensed sponsor.
    - **Job Linking**: When employers post jobs, auto-match their company name against this list to display a "Verified Sponsor" badge.

### 2.3 Bilingual Job Posting System
- **Description**: Support for English and Chinese content in job posts.
- **Functionality**:
    - **Interface**: UI supports switching between EN/CN.
    - **Content**: Job posts can have fields for both languages (e.g., `title_en`, `title_cn`, `description_en`, `description_cn`).
    - **Fallback**: If one language is missing, show the other.

## 3. User Flows

### 3.1 Job Seeker
1. **Landing**: View featured jobs, search bar (keyword, location, sponsor status).
2. **Search**: Filter by "Visa Sponsorship Available".
3. **View Job**: See job details, company sponsor status.
4. **Apply**: Click apply (external link or email for MVP).

### 3.2 Employer
1. **Register/Login**: Via Email or WeChat.
2. **Post Job**: Fill in job details (EN/CN).
3. **Company Profile**: Enter company name. System checks against Visa Sponsor List.
4. **Manage**: Edit/Delete posts.

## 4. Non-Functional Requirements
- **Performance**: Fast loading (Next.js SSR/ISR).
- **SEO**: Optimized for keywords like "UK Visa Jobs", "Chinese Jobs UK".
- **Mobile**: Fully responsive design (Tailwind CSS).
