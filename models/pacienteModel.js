const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    telefono: { type: String, required: false, unique: true },
    correo: { type: String, required: false, unique: true },
    numSesiones: { type: Number, default: 0 } // Conteo de sesiones para este paciente
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;