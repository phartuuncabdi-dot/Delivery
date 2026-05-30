# Dhammaan Endpoints + JSON Input

**Base URL:** `http://localhost:5119`

**Headers (POST/PUT):**
```
Content-Type: application/json
```

**Headers (marka token loo baahdo):**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

> **Xusuusin:** Login/Register = **POST** kaliya. GET ma shaqeeyo login-ka.  
> Token ka hel login → ku dheji Thunder Env `token` → isticmaal `Bearer {{token}}`

---

## Akoonnada tijaabada

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@delivery.com | Admin@123 |
| Customer | customer1@test.com | Customer@123 |
| Driver | driver1@test.com | Driver@123 |

---

# 1. AUTH — Token MA loo baahna

---

### 1.1 Register Customer
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/auth/register` |
| **Token** | ❌ Ma laha |

**JSON Body:**
```json
{
  "email": "customer1@test.com",
  "password": "Customer@123",
  "name": "Ahmed Ali",
  "phone": "0612345678",
  "address": "Mogadishu Hodan",
  "role": "Customer"
}
```

---

### 1.2 Register Driver
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/auth/register` |
| **Token** | ❌ Ma laha |

**JSON Body:**
```json
{
  "email": "driver2@test.com",
  "password": "Driver@123",
  "name": "Ali Driver",
  "phone": "0611223344",
  "address": "Motorcycle",
  "role": "Driver"
}
```
> `address` field driver-ka waxaa loo isticmaalaa `vehicleType`

---

### 1.3 Login Admin
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/auth/login` |
| **Token** | ❌ Ma laha |

**JSON Body:**
```json
{
  "email": "admin@delivery.com",
  "password": "Admin@123"
}
```

---

### 1.4 Login Customer
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/auth/login` |
| **Token** | ❌ Ma laha |

**JSON Body:**
```json
{
  "email": "customer1@test.com",
  "password": "Customer@123"
}
```

---

### 1.5 Login Driver
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/auth/login` |
| **Token** | ❌ Ma laha |

**JSON Body:**
```json
{
  "email": "driver1@test.com",
  "password": "Driver@123"
}
```

**Jawaab (login/register):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "customer1@test.com",
  "role": "Customer",
  "userId": 2
}
```

---

# 2. CUSTOMER — Token: Customer

---

### 2.1 Create Order
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/orders` |
| **Token** | ✅ Customer |

**JSON Body:**
```json
{
  "productName": "Pizza Large",
  "quantity": 2,
  "deliveryAddress": "Hodan District, Street 5",
  "scheduledDate": "2026-05-17T14:00:00"
}
```

---

### 2.2 My Orders
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/orders/my` |
| **Token** | ✅ Customer |
| **JSON Body** | ❌ Ma jiro |

---

### 2.3 Get Order by ID
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/orders/1` |
| **Token** | ✅ Customer (ama Admin) |
| **JSON Body** | ❌ Ma jiro |

> Beddel `1` → `orderId` dhabta ah

---

### 2.4 Create Payment
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/payments` |
| **Token** | ✅ Customer |

**JSON Body:**
```json
{
  "orderId": 1,
  "amount": 25.50,
  "paymentMethod": "Cash"
}
```

---

### 2.5 Get Payments by Order
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/payments/order/1` |
| **Token** | ✅ Customer |
| **JSON Body** | ❌ Ma jiro |

---

# 3. ADMIN — Token: Admin

---

### 3.1 Get All Customers
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/admin/customers` |
| **Token** | ✅ Admin |
| **JSON Body** | ❌ Ma jiro |

---

### 3.2 Get All Drivers
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/admin/drivers` |
| **Token** | ✅ Admin |
| **JSON Body** | ❌ Ma jiro |

---

### 3.3 Create Driver (Admin)
| | |
|---|---|
| **Method** | `POST` |
| **URL** | `http://localhost:5119/api/admin/drivers` |
| **Token** | ✅ Admin |

**JSON Body:**
```json
{
  "email": "driver3@test.com",
  "password": "Driver@123",
  "driverName": "Hassan Driver",
  "phone": "0611111111",
  "vehicleType": "Motorcycle"
}
```

---

### 3.4 Get All Orders
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/admin/orders` |
| **Token** | ✅ Admin |
| **JSON Body** | ❌ Ma jiro |

---

### 3.5 Assign Driver to Order
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5119/api/admin/orders/1/assign-driver` |
| **Token** | ✅ Admin |

**JSON Body:**
```json
{
  "driverId": 1
}
```

---

### 3.6 Update Order Status (Admin)
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5119/api/admin/orders/1/status` |
| **Token** | ✅ Admin |

**JSON Body:**
```json
{
  "status": "InTransit"
}
```

**Status values:** `Pending`, `Assigned`, `PickedUp`, `InTransit`, `Delivered`, `Cancelled`

---

### 3.7 Delivery Report
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/admin/reports/deliveries` |
| **Token** | ✅ Admin |
| **JSON Body** | ❌ Ma jiro |

---

### 3.8 Customer Report
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/admin/reports/customers` |
| **Token** | ✅ Admin |
| **JSON Body** | ❌ Ma jiro |

---

# 4. DRIVER — Token: Driver

---

### 4.1 My Assignments
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/drivers/assignments` |
| **Token** | ✅ Driver |
| **JSON Body** | ❌ Ma jiro |

---

### 4.2 Update Delivery Status
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5119/api/drivers/orders/1/status` |
| **Token** | ✅ Driver |

**JSON Body:**
```json
{
  "status": "InTransit"
}
```

**Status values:** `PickedUp`, `InTransit`, `Delivered`, `Cancelled`

---

### 4.3 Complete Delivery
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5119/api/drivers/orders/1/complete` |
| **Token** | ✅ Driver |
| **JSON Body** | ❌ Ma jiro (body madhan) |

---

# 5. NOTIFICATIONS — Token: kasta (Admin/Customer/Driver)

---

### 5.1 Get My Notifications
| | |
|---|---|
| **Method** | `GET` |
| **URL** | `http://localhost:5119/api/notifications` |
| **Token** | ✅ |
| **JSON Body** | ❌ Ma jiro |

---

### 5.2 Mark Notification as Read
| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `http://localhost:5119/api/notifications/1/read` |
| **Token** | ✅ |
| **JSON Body** | ❌ Ma jiro |

> Beddel `1` → `notificationId`

---

# LIISKA DHAMMAAN (22 endpoints)

| # | Method | Endpoint | JSON? | Token Role |
|---|--------|----------|-------|------------|
| 1 | POST | /api/auth/register | ✅ | ❌ |
| 2 | POST | /api/auth/login | ✅ | ❌ |
| 3 | POST | /api/orders | ✅ | Customer |
| 4 | GET | /api/orders/my | ❌ | Customer |
| 5 | GET | /api/orders/{id} | ❌ | Customer |
| 6 | POST | /api/payments | ✅ | Customer |
| 7 | GET | /api/payments/order/{id} | ❌ | Customer |
| 8 | GET | /api/admin/customers | ❌ | Admin |
| 9 | GET | /api/admin/drivers | ❌ | Admin |
| 10 | POST | /api/admin/drivers | ✅ | Admin |
| 11 | GET | /api/admin/orders | ❌ | Admin |
| 12 | PUT | /api/admin/orders/{id}/assign-driver | ✅ | Admin |
| 13 | PUT | /api/admin/orders/{id}/status | ✅ | Admin |
| 14 | GET | /api/admin/reports/deliveries | ❌ | Admin |
| 15 | GET | /api/admin/reports/customers | ❌ | Admin |
| 16 | GET | /api/drivers/assignments | ❌ | Driver |
| 17 | PUT | /api/drivers/orders/{id}/status | ✅ | Driver |
| 18 | PUT | /api/drivers/orders/{id}/complete | ❌ | Driver |
| 19 | GET | /api/notifications | ❌ | Any |
| 20 | PUT | /api/notifications/{id}/read | ❌ | Any |

---

# Habka tijaabinta (kala horreysi)

```
1.  POST /api/auth/login          (Admin JSON)
2.  POST /api/auth/register       (Customer JSON)
3.  POST /api/auth/login          (Customer JSON) → token
4.  POST /api/orders              (Create Order JSON)
5.  GET  /api/orders/my
6.  POST /api/auth/login          (Admin JSON) → token
7.  POST /api/admin/drivers       (Create Driver JSON)
8.  PUT  /api/admin/orders/1/assign-driver
9.  POST /api/auth/login          (Driver JSON) → token
10. PUT  /api/drivers/orders/1/status
11. PUT  /api/drivers/orders/1/complete
12. POST /api/payments            (Payment JSON)
13. GET  /api/admin/reports/deliveries
```
