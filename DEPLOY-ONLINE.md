# Delivery System — Online (Railway + Vercel + Neon)

Tallaabooyin cad cad: **Database → Neon PostgreSQL** | **Backend → Railway** | **Frontend → Vercel**

---

## MUHIIM — Database

Mashruucan wuxuu isticmaalaa **Neon PostgreSQL** (cloud). Railway **ma gaari karo** SQL Server guriga (`DESKTOP-OIG4FHC`).

Neon connection string (Npgsql) — ka hel Neon dashboard → **Connection string** → dooro **.NET**:

```
Host=ep-xxxx.region.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

Haddii Neon ku siiyo URI (`postgresql://...`), beddel Npgsql format sida kor.

**Amniga:** Ha gelin password GitHub. Railway → Variables kaliya.

---

# QAYBTA 1 — Neon PostgreSQL — 10 daqiiqo

### 1.1 Account
1. Tag https://neon.tech
2. Sign up (free tier)

### 1.2 Project
1. **New Project** → magac tusaale `delivery-system`
2. Database: `neondb` (default waa sax)
3. **Connection details** → copy **.NET** connection string

### 1.3 Migrations (hal mar — developer PC)
Guriga, `backend/DeliverySystem.Api/appsettings.Development.json` geli connection string Neon (file-kan **ma** la push gareeyo Git).

```powershell
cd backend
dotnet ef database update --project DeliverySystem.Infrastructure --startup-project DeliverySystem.Api
```

Ama marka API Railway bilaabmo, `Program.cs` wuxuu ordayaa `MigrateAsync()` + seed admin.

---

# QAYBTA 2 — Backend on Railway — 20 daqiiqo

### 2.1 Account
1. Tag https://railway.app
2. **Login with GitHub**

### 2.2 Mashruuca GitHub
1. GitHub → **New repository** → `delivery-system`
2. Push folder-kaaga (`backend/`, `frontend/`)
3. PowerShell:
```powershell
cd "C:\Users\PC\OneDrive\Desktop\Delivery system"
git init
git add .
git commit -m "Delivery system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/delivery-system.git
git push -u origin main
```

### 2.3 Railway project
1. Railway → **New Project** → **Deploy from GitHub repo**
2. Dooro repo `delivery-system`
3. **Settings** → **Root Directory** → `backend`
4. **Settings** → **Build** → Dockerfile (auto from `railway.toml`)

### 2.4 Environment Variables (Railway → Variables)

| Name | Value |
|------|--------|
| `ConnectionStrings__DefaultConnection` | Neon Npgsql connection string (kor) |
| `Jwt__Key` | `DeliverySystemSecretKey2026SchoolProject!` |
| `Jwt__Issuer` | `DeliverySystem` |
| `Jwt__Audience` | `DeliverySystemUsers` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

### 2.5 Deploy
1. **Deploy** — sug ilaa **Success**
2. **Settings** → **Networking** → **Generate Domain**
3. Tijaabi: `https://YOUR-URL.up.railway.app/health` → `{"status":"healthy"}`

### 2.6 Login tijaabi
```
POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/login
Content-Type: application/json

{"email":"admin@delivery.com","password":"Admin@123"}
```

Admin waa la seed gareeyaa marka API ugu horreysa Neon ku xirnaado.

---

# QAYBTA 3 — Frontend on Vercel — 15 daqiiqo

### 3.1 Account
1. Tag https://vercel.com
2. **Sign up with GitHub**

### 3.2 Import project
1. **Add New** → **Project** → import `delivery-system`
2. **Root Directory:** `frontend`
3. Framework: **Vite**

### 3.3 Environment Variable

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app` |

**MUHIIM:** Ha ku darin `/api` dhamaadka — code-ku wuu ku darayaa.

### 3.4 Deploy
1. **Deploy** → hel `https://delivery-system-xxx.vercel.app`
2. Login: `admin@delivery.com` / `Admin@123`

---

# QAYBTA 4 — Haddii qalad dhaco

| Qalad | Xal |
|-------|-----|
| Railway build fail | Hubi `backend/Dockerfile`, Root = `backend` |
| Database connection fail | Neon connection string sax, SSL Mode=Require, isticmaal **pooler** host Neon |
| Vercel login network error | `VITE_API_URL` = Railway URL sax |
| CORS error | Backend AllowAnyOrigin — redeploy backend |
| 404 on refresh Vercel | `frontend/vercel.json` rewrite |

---

# Soo koobid — Taxanaha

```
1. Neon → connection string (Npgsql)
2. GitHub → push code (password HA ku jirin repo)
3. Railway → backend + ConnectionStrings__DefaultConnection + domain
4. Tijaabi /health + /api/auth/login
5. Vercel → frontend + VITE_API_URL = Railway URL
6. Fur Vercel link → login
```

---

# Local development (guriga)

1. Copy `backend/DeliverySystem.Api/appsettings.Development.json.example` → `appsettings.Development.json`
2. Gel Neon connection string
3. Run:
```powershell
.\START.bat
```
- Frontend: http://localhost:5179 (ama 5173 — eeg terminal)
- Backend: http://localhost:5119

Online iyo local waa isku code — environment variables way kala duwan yihiin.
