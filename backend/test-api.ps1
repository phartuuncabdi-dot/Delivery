# Delivery System - API Test Script
# Run: powershell -File test-api.ps1

$base = "http://localhost:5119"
$pass = 0; $fail = 0

function Test-Endpoint($step, $name, $method, $path, $body, $token) {
    Write-Host "`n[$step] $name" -ForegroundColor Cyan
    Write-Host "  $method $path" -ForegroundColor DarkGray
    if ($body) {
        Write-Host "  Body:" -ForegroundColor DarkGray
        Write-Host ($body | ConvertTo-Json -Compress) -ForegroundColor DarkGray
    }
    try {
        $h = @{ "Content-Type" = "application/json" }
        if ($token) { $h["Authorization"] = "Bearer $token" }
        $p = @{ Uri = "$base$path"; Method = $method; Headers = $h }
        if ($body) { $p.Body = ($body | ConvertTo-Json) }
        $r = Invoke-RestMethod @p
        Write-Host "  OK" -ForegroundColor Green
        $r | ConvertTo-Json -Depth 4 | Write-Host
        $script:pass++
        return $r
    } catch {
        Write-Host "  FAIL: $($_.ErrorDetails.Message)" -ForegroundColor Red
        $script:fail++
        return $null
    }
}

Write-Host "=== DELIVERY SYSTEM API TEST ===" -ForegroundColor Yellow
Write-Host "Base: $base`n"

# AUTH
$admin = Test-Endpoint 1 "Login Admin" POST "/api/auth/login" @{ email="admin@delivery.com"; password="Admin@123" } $null
$adminToken = $admin.token

Test-Endpoint 2 "Register Customer" POST "/api/auth/register" @{
    email="testcustomer@mail.com"; password="Test@123"; name="Test User"
    phone="0600000000"; address="Mogadishu"; role="Customer"
} $null | Out-Null

$cust = Test-Endpoint 3 "Login Customer" POST "/api/auth/login" @{ email="customer1@test.com"; password="Customer@123" } $null
$custToken = $cust.token

# CUSTOMER
$order = Test-Endpoint 4 "Create Order" POST "/api/orders" @{
    productName="Test Pizza"; quantity=1; deliveryAddress="KM4"; scheduledDate="2026-05-20T12:00:00"
} $custToken
$oid = if ($order) { $order.orderId } else { 1 }

Test-Endpoint 5 "My Orders" GET "/api/orders/my" $null $custToken | Out-Null
Test-Endpoint 6 "Get Order" GET "/api/orders/$oid" $null $custToken | Out-Null

# ADMIN
Test-Endpoint 7 "Admin Customers" GET "/api/admin/customers" $null $adminToken | Out-Null
Test-Endpoint 8 "Admin Drivers" GET "/api/admin/drivers" $null $adminToken | Out-Null
Test-Endpoint 9 "Admin Orders" GET "/api/admin/orders" $null $adminToken | Out-Null
Test-Endpoint 10 "Assign Driver" PUT "/api/admin/orders/$oid/assign-driver" @{ driverId=1 } $adminToken | Out-Null

# DRIVER
$drv = Test-Endpoint 11 "Login Driver" POST "/api/auth/login" @{ email="driver1@test.com"; password="Driver@123" } $null
if ($drv) {
    Test-Endpoint 12 "Driver Assignments" GET "/api/drivers/assignments" $null $drv.token | Out-Null
    Test-Endpoint 13 "Complete Order" PUT "/api/drivers/orders/$oid/complete" $null $drv.token | Out-Null
}

# PAYMENT & REPORTS
Test-Endpoint 14 "Create Payment" POST "/api/payments" @{ orderId=[int]$oid; amount=10; paymentMethod="Cash" } $custToken | Out-Null
Test-Endpoint 15 "Notifications" GET "/api/notifications" $null $custToken | Out-Null
Test-Endpoint 16 "Delivery Report" GET "/api/admin/reports/deliveries" $null $adminToken | Out-Null

Write-Host "`n=== RESULT: $pass passed, $fail failed ===" -ForegroundColor $(if($fail -eq 0){"Green"}else{"Red"})
