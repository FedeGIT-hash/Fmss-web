const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FMSS API is running');
});

// Endpoint de prueba para login (mock)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Simulación: aceptar cualquier usuario por ahora
  if (email && password) {
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      token: 'mock-jwt-token-123456',
      user: {
        id: 1,
        nombre: 'Usuario Prueba',
        email: email
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }
});

app.listen(PORT, () => {
  appsi
  console.log(`Server running on port ${PORT}`);
});
