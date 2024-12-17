const express = require('express');
const router = express.Router();
const pacienteController = require('./controllers/pacienteController');
const citasController = require('./controllers/citasController');

// Rutas para pacientes
router.post('/pacientes', pacienteController.crearPaciente);
router.get('/pacientes', pacienteController.obtenerPacientes);
router.get('/pacientes/:id', pacienteController.obtenerPacientePorId);
router.put('/pacientes/:id', pacienteController.editarPaciente); // Ruta para editar paciente
router.delete('/pacientes/:id', pacienteController.eliminarPaciente); // Ruta para eliminar paciente

// Rutas para citas
router.post('/citas', citasController.crearCita);
router.get('/citas', citasController.obtenerCitas);
router.get('/citas/:id', citasController.obtenerCitaPorId);
router.put('/citas/:id', citasController.editarCita);
router.delete('/citas/:id', citasController.eliminarCita);

module.exports = router;
