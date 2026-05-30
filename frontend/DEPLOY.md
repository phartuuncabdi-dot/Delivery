# Frontend Online (Website)

## Muhiim

Frontend online **waxay u baahan tahay backend online** sidoo kale.  
Haddii backend kaliya `localhost` yahay, website-ka online **ma shaqeyn doonto** login/API.

---

## Habka 1: Vercel (ugu fudud — FREE)

### Tallaabooyin

1. Account samee: https://vercel.com/signup
2. Install Vercel CLI (hal mar):
   ```powershell
   npm install -g vercel
   ```
3. Backend-ka online dhig (Azure, Railway, Render) — hel URL tusaale:
   `https://delivery-api-xxxx.azurewebsites.net`
4. Samee file `frontend/.env.production`:
   ```
   VITE_API_URL=https://delivery-api-xxxx.azurewebsites.net
   ```
5. Deploy:
   ```powershell
   cd frontend
   npm run build
   vercel --prod
   ```
6. Vercel wuxuu ku siinayaa link: `https://delivery-system-xxx.vercel.app`

### GitHub + Vercel (automatic)

1. Push mashruuca GitHub
2. Vercel → **Add New Project** → import repo
3. **Root Directory:** `frontend`
4. **Environment Variable:** `VITE_API_URL` = backend URL-kaaga
5. Deploy

---

## Habka 2: Netlify (FREE)

1. https://app.netlify.com
2. Drag & drop folder `frontend/dist` (ka dib `npm run build`)
3. Ama connect GitHub, base directory: `frontend`
4. Env: `VITE_API_URL` = backend URL

---

## Habka 3: Azure Static Web Apps (school server)

Haddii school Azure isticmaasho — Static Web App + link API-ga SQL server-kaaga.

---

## Build locally

```powershell
cd frontend
# Set API URL first in .env.production
npm run build
```

Output: `frontend/dist/` — upload to any static host.

---

## CORS

Backend `Program.cs` wuxuu leeyahay `AllowAnyOrigin()` — frontend online wuu shaqeyn karaa haddii `VITE_API_URL` sax yahay.
