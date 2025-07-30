# Script para actualizar tamaños de burbujas en register.component.css
$filePath = "src\app\auth\pages\register\register.component.css"

# Leer el contenido del archivo
$content = Get-Content $filePath -Raw

# Actualizar las burbujas laterales (6-10)
$content = $content -replace 'width: 80px; height: 80px;\s+top: 30%;\s+right: 1%;', 'width: 18px; height: 18px; top: 30%; right: 25%;'
$content = $content -replace 'width: 90px; height: 90px;\s+bottom: 30%;\s+left: 1%;', 'width: 24px; height: 24px; bottom: 35%; left: 28%;'
$content = $content -replace 'width: 85px; height: 85px;\s+bottom: 1%;\s+left: 50%;', 'width: 20px; height: 20px; bottom: 10%; left: 45%;'
$content = $content -replace 'width: 75px; height: 75px;\s+top: 1%;\s+left: 30%;', 'width: 16px; height: 16px; top: 8%; left: 42%;'
$content = $content -replace 'width: 95px; height: 95px;\s+top: 1%;\s+left: 70%;', 'width: 26px; height: 26px; top: 12%; left: 55%;'

# Actualizar burbujas 11-15
$content = $content -replace 'width: 65px; height: 65px;\s+top: 70%;\s+right: 1%;', 'width: 14px; height: 14px; top: 65%; right: 30%;'
$content = $content -replace 'width: 105px; height: 105px;\s+bottom: 30%;\s+right: 1%;', 'width: 22px; height: 22px; bottom: 32%; right: 20%;'
$content = $content -replace 'width: 70px; height: 70px;\s+top: 1%;\s+right: 30%;', 'width: 15px; height: 15px; top: 5%; right: 40%;'
$content = $content -replace 'width: 88px; height: 88px;\s+bottom: 1%;\s+right: 30%;', 'width: 19px; height: 19px; bottom: 8%; right: 42%;'
$content = $content -replace 'width: 72px; height: 72px;\s+bottom: 1%;\s+right: 70%;', 'width: 17px; height: 17px; bottom: 15%; right: 48%;'

# Escribir el contenido actualizado
Set-Content $filePath $content -Encoding UTF8

Write-Host "Burbujas actualizadas en register.component.css"
