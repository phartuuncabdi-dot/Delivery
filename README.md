# Delivery System

Full-stack delivery management system.

## Project structure

```
Delivery system/
├── backend/          ASP.NET Core Web API + PostgreSQL (Neon)
│   ├── DeliverySystem.Api/
│   ├── DeliverySystem.Application/
│   ├── DeliverySystem.Domain/
│   ├── DeliverySystem.Infrastructure/
│   └── API-REQUESTS.md
└── frontend/         React + Tailwind CSS + Vite
    └── src/
```

## Run the system

### 1. Backend (Terminal 1)

```powershell
cd backend/DeliverySystem.Api
dotnet run
```

API: **http://localhost:5119**

### 2. Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@delivery.com | Admin@123 |
| Customer | customer1@test.com | Customer@123 |
| Driver | driver1@test.com | Driver@123 |

## Features

- **Customer:** Register, login, place orders, pay, notifications
- **Admin:** Manage customers, drivers, orders, assign drivers, reports
- **Driver:** View assignments, update status, complete deliveries

## Database

**PostgreSQL (Neon)** — cloud database for local and online deploy.

1. Copy `backend/DeliverySystem.Api/appsettings.Development.json.example` to `appsettings.Development.json`
2. Paste your Neon connection string (from [neon.tech](https://neon.tech) dashboard, **.NET** format)
3. Migrations run automatically when the API starts (`MigrateAsync`)

```powershell
cd backend
dotnet ef database update --project DeliverySystem.Infrastructure --startup-project DeliverySystem.Api
```

## Deploy online

**Backend → Railway** | **Frontend → Vercel**

Tallaabooyin buuxa: **[DEPLOY-ONLINE.md](DEPLOY-ONLINE.md)**

Quick start: `START.bat` for local | GitHub push → Railway + Vercel for online
