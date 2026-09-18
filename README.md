# 🚀 SocialPilot — Social Media Scheduler & Campaign Management Platform

<div align="center">

![SocialPilot Banner](https://img.shields.io/badge/SocialPilot-Modern%20Social%20Media%20Management-6366f1?style=for-the-badge&logo=rocket)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A unified, production-grade social media scheduling, multi-platform publishing, campaign management, and analytics workspace built for content creators, agencies, and marketing teams.</b>
</p>

[Key Features](#-key-features) •
[System Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Quick Start](#-quick-start) •
[Environment Variables](#-environment-variables) •
[Admin Portal & 2FA](#-super-admin-portal--2fa) •
[Testing](#-running-tests) •
[Project Structure](#-project-structure)

</div>

---

## 📖 About SocialPilot

Managing multiple social media channels often means switching between fragmented tools, juggling inconsistent upload specifications, risking credential leaks, and losing track of posting schedules.

**SocialPilot** solves this by providing a unified, high-performance web dashboard paired with an asynchronous background publishing engine. Whether you are scheduling a single post, managing an omni-channel marketing campaign, or analyzing engagement performance, SocialPilot delivers a seamless experience with zero-trust security and real-time observability.

---

## ✨ Key Features

### ✍️ 1. Universal Post Composer & Multi-Platform Publishing
- **Rich Media Composer**: Write captions, upload single or multiple high-resolution images (`PNG`, `JPEG`, `WebP`), or upload video assets (`MP4`, `WebM`, `MOV`).
- **Live Platform Previews**: Real-time mock preview of how content will render across different social networks.
- **Native LinkedIn API v2 Integration**:
  - Full **3-Step Digital Media Upload Protocol** (`registerUpload` ➔ Binary Chunk PUT ➔ `ugcPosts` publication).
  - Native post deletion sync using stored `linkedin_urn` identifiers.
  - Automatic `401 Unauthorized` token expiry detection and instant notification dispatch.
- **Facebook, Instagram & X (Twitter) Pipelines**: Multi-account support with direct publishing and scheduled dispatch pipelines.

### ⏱️ 2. Intelligent Background Scheduler
- **APScheduler Engine**: Dedicated background worker polling due posts with high-efficiency composite indexing (`idx_posts_status_scheduled`).
- **Timezone-Aware Scheduling**: Granular date and time controls (12-hour AM/PM and 24-hour formats) respecting user timezones.
- **Automated Lifecycle Transitions**: Transitions state from `Scheduled` ➔ `Publishing` ➔ `Published` or `Failed` with descriptive error logging.

### 🗓️ 3. Interactive Content Calendar & Campaign Manager
- **Visual Planner**: Day, week, and month calendar views with color-coded status badges.
- **Campaign Grouping**: Organize posts under structured marketing campaigns to track cumulative metrics, goals, and team deliverables.

### 📊 4. Hybrid Analytics & Downloadable Reports
- **Interactive Visualizations**: Powered by **Recharts** — track impressions, audience growth, engagement rates, and platform distribution.
- **Custom Reporting**: Export analytics summaries into clean reports for clients or stakeholders.

### 🔐 5. Zero-Trust Security & Token Vault
- **Encrypted Token Storage**: OAuth access and refresh tokens are encrypted at rest using symmetric **Fernet** cryptography (`vault.py`).
- **JWT Authentication & RBAC**: Role-based access control (`creator`, `admin`, `super_admin`) with BCrypt password hashing.
- **Rate Limiting**: Integrated **SlowAPI** protection against brute-force and volumetric denial-of-service attempts.

### 🛡️ 6. Super Admin Portal (`/socialpilot_admin`)
- **Google Authenticator 2FA (RFC 6238 TOTP)**: Elevated administration area requiring a 6-digit Time-Based One-Time Password.
- **Dynamic Setup QR Code**: Instant QR code provisioning generator for easy pairing with authenticator apps.
- **User Lifecycle Management**: Real-time user directory with cascading account and post deletions.
- **System Health Telemetry**: Live status monitoring for Redis cache, database connection pools, and scheduler jobs.

### 🌐 7. Themes & Localization
- **Theme Switcher**: Smooth transitions between **Light**, **Dark**, and **System** themes.
- **Multilingual Support**: Centralized Language Context for dynamic UI translation.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    User([Content Creator / Marketer]) -->|Interacts with UI| Frontend[Next.js 16 + React 19 Frontend\nTailwind CSS v4 & Lucide Icons]
    Admin([Super Administrator]) -->|TOTP 2FA Login| AdminPortal[Admin Portal /socialpilot_admin]
    
    Frontend -->|REST API Requests + JWT| Backend[FastAPI Backend Server\nUvicorn ASGI]
    AdminPortal -->|Elevated JWT| Backend
    
    subgraph Backend Core Services
        Backend -->|Session Queries| DB[(Database\nSQLite / PostgreSQL)]
        Backend -->|Token Encrypt / Decrypt| Vault[Fernet Security Vault]
        Backend -->|Cache & Rate Limit| Redis[(Redis Cache & Limiter)]
        Backend -->|Metrics & Traces| Telemetry[Prometheus /metrics & Sentry]
    end
    
    subgraph Background Scheduler & Workers
        Scheduler[APScheduler Worker Engine] -->|Polls Due Posts| DB
        Scheduler -->|Fetches Decrypted Tokens| Vault
        Scheduler -->|Publishes Post| Publisher[Social Media Dispatcher]
    end
    
    subgraph External Social APIs
        Publisher -->|v2 API / UGC Posts| LinkedIn[LinkedIn API v2]
        Publisher -->|Graph API| Meta[Facebook / Instagram Graph API]
        Publisher -->|v2 Endpoints| Twitter[Twitter / X API]
    end
```

---

## 💻 Tech Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **Next.js 16** | App Router architecture, Server & Client Components |
| **React 19** | Modern UI rendering library |
| **Tailwind CSS v4** | Utility-first styling with modern CSS variables |
| **Lucide React & React Icons** | Iconography and social media brand badges |
| **Recharts** | Declarative charting library for analytics |
| **Date-fns & React Day Picker** | Date calculation and interactive date selection |
| **Axios** | HTTP client with automatic auth header injection and interceptors |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **FastAPI** | High-performance Python ASGI web framework |
| **SQLAlchemy 2.0** | Robust ORM for data modeling and query building |
| **Alembic** | Database schema version control and migrations |
| **APScheduler** | Advanced Python background task scheduling engine |
| **PyJWT & Passlib (BCrypt)** | Secure token-based auth and password hashing |
| **Cryptography (Fernet)** | Symmetric encryption for social OAuth tokens |
| **PyOTP & QRCode (Pillow)** | RFC 6238 TOTP two-factor authentication |
| **SlowAPI & Redis** | In-memory caching and IP rate limiting |
| **Prometheus & Sentry SDK** | Telemetry metrics and exception tracking |

---

## 🚀 Quick Start

### Option A: Running with Docker Compose (Fastest & Recommended)

Ensure you have **Docker** and **Docker Compose** installed, then run:

```bash
# 1. Clone the repository
git clone https://github.com/Prathiba-hub/SocialPilot.git
cd SocialPilot

# 2. Build and launch all services (Frontend, Backend, Redis)
docker-compose up --build
```

Once started, the services will be accessible at:
- 🌐 **Frontend Application**: `http://localhost:3000`
- ⚙️ **Backend API**: `http://localhost:8000`
- 📚 **Interactive Swagger API Docs**: `http://localhost:8000/docs`
- 🛡️ **Super Admin Portal**: `http://localhost:3000/socialpilot_admin`
- 📈 **Prometheus Telemetry**: `http://localhost:8000/metrics`

---

### Option B: Manual Local Setup

#### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `v3.10` or higher
- **Redis** (optional for local caching, falls back gracefully)

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment file
cp .env.example .env

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the project root
cd ..

# Install frontend packages
npm install

# Copy and configure environment file
cp .env.example .env.local

# Start the Next.js development server
npm run dev
```

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

```env
# LinkedIn OAuth Credentials
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8000/oauth/linkedin/callback

# Facebook / Meta OAuth Credentials
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/api/social/facebook/callback

# Security Keys
VAULT_ENCRYPTION_KEY=your_fernet_32_byte_base64_encryption_key
SECRET_KEY=your_jwt_signing_secret_key
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Super Admin 2FA Settings
ADMIN_USERNAME=admin
ADMIN_TOTP_SECRET=2QUMENL2BFM2GEEJWJ3SQTGWG2YMXRFY

# Client URL
FRONTEND_URL=http://localhost:3000

# Optional Redis / Database URL (falls back to SQLite and local memory in dev)
# DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/socialpilot
# REDIS_URL=redis://localhost:6379
```

### Frontend Configuration (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🛡️ Super Admin Portal & 2FA

SocialPilot comes with a dedicated administrative dashboard accessible at `/socialpilot_admin`.

### How to set up Admin 2FA:
1. Navigate to `http://localhost:3000/socialpilot_admin/login`.
2. Enter the administrator username (`admin` by default).
3. If logging in for the first time, scan the dynamically generated **QR Code** using **Google Authenticator**, **Authy**, or **1Password**.
4. Enter the 6-digit TOTP verification code to gain elevated access.
5. From the Admin Portal, you can:
   - View all registered users and account creation dates.
   - Perform cascading user deletions (which cleanly purges posts, campaigns, tokens, and notifications).
   - Inspect live system metrics and server health.

---

## 🧪 Running Tests

The backend includes a comprehensive automated test suite covering security, OAuth, the APScheduler engine, and media handling:

```bash
cd backend

# Run the complete test suite
pytest -v

# Run specific phase tests:
pytest test_phase1_security.py -v           # Authentication & Vault encryption
pytest test_phase2_db_optimization.py -v   # Database schemas & cascade relationships
pytest test_phase3_performance.py -v       # Cache & rate-limiting checks
pytest tests/test_publish_engine.py -v     # Multi-platform post publisher
```

---

## 📂 Project Structure

```
socialpilot-frontend/
├── 📁 backend/                       # FastAPI Backend Application
│   ├── 📁 alembic/                   # Database migrations
│   ├── 📁 app/
│   │   ├── 📁 api/                   # REST API Routers
│   │   │   ├── accounts.py           # Connected social accounts
│   │   │   ├── admin.py              # Super Admin & TOTP 2FA
│   │   │   ├── analytics.py          # Metrics & platform statistics
│   │   │   ├── auth.py               # User authentication & registration
│   │   │   ├── campaign.py           # Marketing campaigns
│   │   │   ├── facebook.py           # Meta Graph API integration
│   │   │   ├── media.py              # Media uploads & asset management
│   │   │   ├── oauth.py              # Social OAuth handshakes
│   │   │   ├── post.py               # Post management CRUD
│   │   │   ├── publish.py            # Real-time and scheduled dispatch
│   │   │   ├── reports.py            # Analytics reports export
│   │   │   ├── schedule.py           # Scheduling & calendar endpoints
│   │   │   ├── settings.py           # User preferences & profile
│   │   │   ├── webhooks.py           # Social network webhook listeners
│   │   │   └── workspace.py          # Workspace notifications & team status
│   │   ├── 📁 core/                  # Core Utilities & Security
│   │   │   ├── limiter.py            # SlowAPI rate limiting configuration
│   │   │   ├── redis.py              # Redis client & caching layer
│   │   │   ├── security.py           # Password hashing & JWT logic
│   │   │   └── vault.py              # Fernet symmetric token encryption
│   │   ├── 📁 models/                # SQLAlchemy Database Models
│   │   │   ├── campaign.py           # Campaign entity
│   │   │   ├── notification.py       # Notification entity
│   │   │   ├── post.py               # Post entity (with composite indexing)
│   │   │   ├── scheduled_post.py     # Scheduled post entity
│   │   │   ├── social_account.py     # Social Account token vault entity
│   │   │   └── user.py               # User entity (with cascade delete)
│   │   ├── 📁 scheduler/             # APScheduler background worker
│   │   │   └── worker.py             # Polling and automated post dispatcher
│   │   ├── 📁 schemas/               # Pydantic request/response schemas
│   │   ├── 📁 services/              # Third-party platform SDK services
│   │   │   ├── facebook_service.py   # Facebook Graph client
│   │   │   ├── instagram_service.py  # Instagram media publishing
│   │   │   └── social_media.py       # LinkedIn 3-step media upload & deletion
│   │   ├── database.py               # Database engine & session maker
│   │   └── main.py                   # FastAPI initialization & ASGI middleware
│   ├── 📁 tests/                     # Pytest suite
│   ├── Dockerfile                    # Backend Docker container configuration
│   └── requirements.txt              # Python package dependencies
│
├── 📁 src/                           # Next.js 16 Frontend Application
│   ├── 📁 app/                       # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes (login, register, reset)
│   │   ├── dashboard/                # Protected workspace views
│   │   │   ├── accounts/             # Social media account connections
│   │   │   ├── analytics/            # Analytics charts and trends
│   │   │   ├── calendar/             # Visual content calendar
│   │   │   ├── campaigns/            # Campaign tracking
│   │   │   ├── notifications/        # Workspace notifications feed
│   │   │   ├── posts/                # Post composer & post management
│   │   │   ├── reports/              # Performance reports
│   │   │   ├── settings/             # Profile & app settings
│   │   │   └── team/                 # Team collaboration & invites
│   │   ├── socialpilot_admin/        # Super Admin Portal (TOTP login & user management)
│   │   ├── layout.js                 # Root layout with providers
│   │   └── page.js                   # Landing page
│   ├── 📁 components/                # Modular React UI components
│   ├── 📁 context/                   # Auth, Theme, and Language Contexts
│   └── 📁 lib/                       # API client services & Axios configuration
│
├── docker-compose.yml                # Multi-service container orchestration
├── package.json                      # Frontend dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! If you want to contribute to SocialPilot:

1. **Fork** the repository.
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'feat: Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the SocialPilot Team.</sub>
</div>
