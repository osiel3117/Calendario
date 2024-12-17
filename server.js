require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rutas = require('./routes'); // Importar las rutas


const app = express();

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB', err));


// Servir archivos estáticos desde mi-app/www
app.use(express.static(path.join(__dirname, 'mi-app', 'www')));

// Rutas para las vistas
app.get('/agendar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mi-app', 'www', 'agendar.html'));
});

app.get('/calendario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mi-app', 'www', 'calendario.html'));
});

app.get('/cita.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mi-app', 'www', 'cita.html'));
});

app.get('/agendacitas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'agendacitas.html'));
});

app.get('/config.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mi-app', 'www', 'config.html'));
});

app.get('/pacientes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'mi-app', 'www', 'pacientes.html'));
});


// Usar las rutas de la API
app.use('/api', rutas);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
