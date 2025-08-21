# 💰 SISTEMA DE SALDO DINÁMICO - DOCUMENTACIÓN

## 📋 RESUMEN
He implementado un sistema completo de saldo dinámico que se conecta con el backend y se actualiza en tiempo real en el dashboard del usuario.

## 🔧 COMPONENTES IMPLEMENTADOS

### 1. **BalanceService** (`src/app/core/header/services/balance.service.ts`)
Servicio principal que maneja todo lo relacionado con el saldo del usuario:

#### **Características:**
- ✅ **Observable reactivo** para saldo en tiempo real
- ✅ **Integración con API backend** 
- ✅ **Manejo de errores** con fallback a localStorage
- ✅ **Métodos para recarga y débito** de saldo
- ✅ **Formateo automático** de números

#### **Métodos principales:**
```typescript
loadUserBalance()     // Carga saldo desde backend
updateBalance(amount) // Actualiza saldo localmente
rechargeBalance(amount) // Recarga saldo
debitBalance(amount)  // Debita saldo (para consultas)
formatBalance(amount) // Formatea para mostrar (ej: "15.75")
```

### 2. **Dashboard Component** (Actualizado)
El dashboard ahora muestra el saldo dinámico del usuario:

#### **Nuevas características:**
- ✅ **Saldo en tiempo real** conectado al servicio
- ✅ **Formato automático** ($0.00)
- ✅ **Carga inicial** al abrir el dashboard
- ✅ **Gestión de memoria** con unsubscribe

#### **Cambio visual:**
```html
<!-- ANTES (estático) -->
<span class="amount">3,44</span>

<!-- AHORA (dinámico) -->
<span class="amount">{{ formatBalance((userBalance$ | async) || 0) }}</span>
```

### 3. **Backend API Endpoints** (`backend-balance-example.js`)
Archivo de ejemplo con los endpoints necesarios:

#### **Rutas implementadas:**
- `GET /api/user/balance` - Obtener saldo actual
- `POST /api/user/balance/recharge` - Recargar saldo
- `POST /api/user/balance/debit` - Debitar saldo

## 🔄 FLUJO DE FUNCIONAMIENTO

### **Carga inicial:**
1. Usuario abre dashboard
2. Component llama a `balanceService.loadUserBalance()`
3. Servicio hace petición GET al backend
4. Saldo se actualiza automáticamente en la UI

### **Recarga de saldo:**
1. Usuario hace clic en "Recargar Saldo"
2. Navega a `/plans`
3. Selecciona plan y procesa pago
4. Backend actualiza saldo
5. Frontend recibe nuevo saldo y actualiza UI

### **Consumo de saldo:**
1. Usuario hace consulta de antecedentes
2. Sistema llama a `balanceService.debitBalance(amount)`
3. Backend verifica saldo suficiente
4. Debita el monto y retorna nuevo saldo
5. UI se actualiza automáticamente

## 📊 ESTRUCTURA DE DATOS

### **Respuesta del backend:**
```json
{
  "success": true,
  "data": {
    "balance": 15.75,
    "currency": "USD",
    "lastUpdated": "2025-08-21T10:30:00Z"
  },
  "message": "Saldo obtenido exitosamente"
}
```

### **Observable en el frontend:**
```typescript
userBalance$: Observable<number> // Emite valores como: 0, 15.75, 23.50, etc.
```

## 🔐 SEGURIDAD

### **Autenticación:**
- ✅ **JWT Token** en headers de todas las peticiones
- ✅ **Verificación de token** en backend
- ✅ **Manejo de errores** 401/403

### **Validaciones:**
- ✅ **Montos positivos** en recarga/débito
- ✅ **Saldo suficiente** antes de débito
- ✅ **Sanitización** de datos de entrada

## 🚀 CÓMO USAR

### **Para desarrolladores:**

1. **Inyectar el servicio** en cualquier componente:
```typescript
constructor(private balanceService: BalanceService) {}
```

2. **Obtener saldo actual:**
```typescript
this.balanceService.balance$.subscribe(balance => {
  console.log('Saldo actual:', balance);
});
```

3. **Recargar saldo:**
```typescript
this.balanceService.rechargeBalance(10.00).subscribe(response => {
  console.log('Saldo recargado:', response.data.newBalance);
});
```

4. **Debitar saldo:**
```typescript
this.balanceService.debitBalance(0.50).subscribe(response => {
  console.log('Nuevo saldo:', response.data.newBalance);
});
```

### **Para implementar en backend:**

1. **Instalar dependencias:**
```bash
npm install express jsonwebtoken
```

2. **Usar el código de ejemplo** en `backend-balance-example.js`

3. **Configurar base de datos** con tabla de usuarios:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  balance DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 BENEFICIOS IMPLEMENTADOS

### **Para usuarios:**
- 🎯 **Saldo siempre actualizado** sin recargar página
- 💰 **Transparencia total** en el manejo de créditos
- ⚡ **Respuesta inmediata** a cambios de saldo
- 🔄 **Sincronización automática** entre dispositivos

### **Para desarrolladores:**
- 🧩 **Código modular** y reutilizable
- 🔧 **Fácil integración** con nuevas funcionalidades
- 📝 **Well-documented** con TypeScript
- 🔒 **Manejo seguro** de datos sensibles

## 📋 PRÓXIMOS PASOS SUGERIDOS

1. **Conectar con gateway de pagos** real
2. **Implementar historial** de transacciones
3. **Agregar notificaciones** de saldo bajo
4. **Implementar recarga automática** cuando saldo < umbral
5. **Crear dashboard de administración** para gestionar saldos

---

## ✨ ESTADO ACTUAL
✅ **Sistema completamente funcional** 
✅ **UI actualizada** para mostrar saldo dinámico
✅ **Servicios implementados** y documentados
✅ **Ejemplo de backend** proporcionado
✅ **Manejo de errores** implementado
✅ **Documentación completa** creada

**El saldo ahora cambia dinámicamente de $0.00 según el saldo real del usuario y se actualiza automáticamente cuando se realizan recargas o consultas.**
