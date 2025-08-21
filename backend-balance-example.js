// backend-balance-example.js
// Este es un ejemplo de cómo implementar los endpoints del backend para el manejo de saldo

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// GET /api/user/balance - Obtener saldo del usuario
router.get('/user/balance', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Aquí consultas tu base de datos para obtener el saldo del usuario
    // Ejemplo con una consulta SQL:
    // const result = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);
    
    // Para este ejemplo, simulamos el saldo
    const userBalance = {
      balance: 15.75, // Este valor vendría de la base de datos
      currency: 'USD',
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: userBalance,
      message: 'Saldo obtenido exitosamente'
    });
    
  } catch (error) {
    console.error('Error getting user balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/user/balance/recharge - Recargar saldo
router.post('/user/balance/recharge', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto inválido'
      });
    }

    // Aquí procesarías el pago con tu gateway de pagos
    // y luego actualizarías el saldo en la base de datos
    
    // Ejemplo de actualización en la base de datos:
    // await db.query('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId]);
    // const newBalance = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);

    // Para este ejemplo, simulamos la nueva balance
    const newBalance = 25.75; // Este sería el nuevo saldo después de la recarga

    res.json({
      success: true,
      data: {
        newBalance: newBalance,
        rechargedAmount: amount,
        timestamp: new Date()
      },
      message: `Saldo recargado exitosamente con $${amount}`
    });
    
  } catch (error) {
    console.error('Error recharging balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando la recarga'
    });
  }
});

// POST /api/user/balance/debit - Debitar saldo (cuando se hace una consulta)
router.post('/user/balance/debit', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto inválido'
      });
    }

    // Verificar que el usuario tenga saldo suficiente
    // const currentBalance = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);
    const currentBalance = 25.75; // Simulado

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente'
      });
    }

    // Debitar el saldo
    // await db.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, userId]);
    // const newBalance = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);

    const newBalance = currentBalance - amount; // Simulado

    res.json({
      success: true,
      data: {
        newBalance: newBalance,
        debitedAmount: amount,
        timestamp: new Date()
      },
      message: `Saldo debitado exitosamente: $${amount}`
    });
    
  } catch (error) {
    console.error('Error debiting balance:', error);
    res.status(500).json({
      success: false,
      message: 'Error debitando el saldo'
    });
  }
});

module.exports = router;
