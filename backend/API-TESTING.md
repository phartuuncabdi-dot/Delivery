# API Testing — Postman & Thunder Client

## 1. Run the API

```powershell
cd backend/DeliverySystem.Api
dotnet run
```

Base URL: **http://localhost:5119**

## 2. Postman

1. Open **Postman**
2. **Import** → `postman/DeliverySystem.postman_collection.json`
3. **Import** → `postman/DeliverySystem.postman_environment.json`
4. Select environment **Delivery System Local**
5. Run **Auth → Login Admin** (token saves automatically)
6. Test other folders

### Default admin

| Field | Value |
|-------|-------|
| Email | admin@delivery.com |
| Password | Admin@123 |

## 3. Thunder Client (VS Code)

1. Install extension: **Thunder Client**
2. **Menu → Import** → `thunder-tests/collections/DeliverySystem.json`
3. **Env** → import `thunder-tests/environments/local.json`
4. Dooro environment **Local** (kor ku xiga dropdown)

### Sida TOKEN loo isticmaalo (MUHIIM!)

**Login = MA u baahna token!** Login wuxuu kuu siiyaa token.

| Qalad ❌ | Sax ✅ |
|---------|--------|
| `GET` /api/auth/login | `POST` /api/auth/login |
| Authorization header login-ka | Login: header ma laha (Content-Type kaliya) |
| `Bearer {eyJhbGci...}` | `Bearer eyJhbGci...` (aan lahayn `{ }`) |
| `Bearer {{token}}` login-ka | Token kaliya requests kale |

**Tallaabooyinka:**

1. Fur **Login Admin** (folder 1. Auth)
2. Hubi: Method = **POST** (ma aha GET!)
3. Tab **Body** → JSON:
   ```json
   { "email": "admin@delivery.com", "password": "Admin@123" }
   ```
4. Tab **Headers** → **tirtir** Authorization haddii uu jiro login-ka
5. Riix **Send** → jawaabta waxaad aragtaa `"token": "eyJhbGci..."`
6. **Env (Local)** → variable `token` → paste token-ka **keliya** (aan `Bearer` lahayn):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. Requests kale (Create Order, Admin, iwm) waxay isticmaalaan:
   ```
   Authorization: Bearer {{token}}
   ```
   Thunder Client wuxuu isku dari `Bearer ` + value-ga `token`.

**Haddii 405 Method Not Allowed:** waxaad isticmaashay GET — beddel **POST**.

## 4. Suggested test order

1. **Login Admin**
2. **Register Customer** (or use existing)
3. **Login Customer**
4. **Create Order** → note `orderId`
5. **Login Admin** again
6. **Create Driver** → note `driverId`
7. **Assign Driver To Order**
8. **Login Driver**
9. **My Assignments** → **Update Status** → **Complete Delivery**
10. **Login Customer** → **Create Payment** → **My Orders**
11. **Login Admin** → **Delivery Report** / **Customer Report**

## 5. Status values

`Pending` | `Assigned` | `PickedUp` | `InTransit` | `Delivered` | `Cancelled`
