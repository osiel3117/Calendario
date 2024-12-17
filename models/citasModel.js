const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    motivo: { type: String, required: false },
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    tipoSesion: { type: String, enum: ['individual', 'pareja', 'familiar'], required: true },
    numSesiones: { type: Number } // Número de sesiones del paciente al momento de esta cita
});

const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita;
