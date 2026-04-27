const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));

const DB_FILE = 'pedidos.json';

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const leerPedidos = () => JSON.parse(fs.readFileSync(DB_FILE));
const guardarPedidos = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

app.post('/verificar', (req, res) => {
  const { playerId } = req.body;

  if (!playerId) {
    return res.status(400).json({ error: "Falta ID" });
  }

  res.json({
    status: "pending",
    mensaje: "Verificación en proceso..."
  });
});

app.post('/pedido', (req, res) => {
  const { playerId, producto, comprobante } = req.body;

  if (!playerId || !producto || !comprobante) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const pedidos = leerPedidos();

  const nuevo = {
    id: Date.now(),
    playerId,
    producto,
    comprobante,
    estado: "pendiente",
    fecha: new Date().toLocaleString()
  };

  pedidos.push(nuevo);
  guardarPedidos(pedidos);

  res.json({
    ok: true,
    pedido: nuevo
  });
});

app.get('/pedidos', (req, res) => {
  res.json(leerPedidos());
});

app.listen(3000, () => {
  console.log("🔥 API corriendo en puerto 3000");
});
