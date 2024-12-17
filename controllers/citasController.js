const Cita = require('../models/citasModel');
const Paciente = require('../models/pacienteModel');

// Crear una nueva cita
exports.crearCita = async (req, res) => {
    const { title, start, end, motivo, paciente, tipoSesion } = req.body;

    try {
        const pacienteExistente = await Paciente.findById(paciente);
        if (!pacienteExistente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Convertir fechas a UTC
        const startUTC = new Date(start).toISOString();
        const endUTC = new Date(end).toISOString();

        const nuevaCita = new Cita({
            title,
            start: startUTC,
            end: endUTC,
            motivo,
            paciente,
            tipoSesion,
            numSesiones: pacienteExistente.numSesiones + 1
        });

        // Actualizar las sesiones del paciente
        pacienteExistente.numSesiones += 1;
        await pacienteExistente.save();

        await nuevaCita.save();
        res.status(201).json({ message: 'Cita creada exitosamente', cita: nuevaCita });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};


// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.find();
        const eventos = citas.map(cita => ({
            id: cita._id,
            title: cita.title,
            start: cita.start,
            end: cita.end,
            extendedProps: {
                motivo: cita.motivo,
                numSesiones: cita.numSesiones,
                telefono: cita.telefono,
                tipoSesion: cita.tipoSesion
            }
        }));

        res.json(eventos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

// Obtener los detalles de una cita por ID
exports.obtenerCitaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const cita = await Cita.findById(id).populate('paciente', 'nombre');
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Asegurarse de devolver las fechas en UTC
        const citaConUTC = {
            ...cita.toObject(),
            start: cita.start.toISOString(),
            end: cita.end.toISOString()
        };

        res.json(citaConUTC);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los detalles de la cita' });
    }
};

// Editar una cita
exports.editarCita = async (req, res) => {
    const { id } = req.params;
    const { title, start, end, motivo, telefono, tipoSesion } = req.body;

    try {
        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Actualizar los datos de la cita
        cita.title = title || cita.title;
        cita.start = start || cita.start;
        cita.end = end || cita.end;
        cita.motivo = motivo || cita.motivo;
        cita.telefono = telefono || cita.telefono;
        cita.tipoSesion = tipoSesion || cita.tipoSesion;

        await cita.save();
        res.status(200).json({ message: 'Cita actualizada exitosamente', cita });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};

// Eliminar una cita
exports.eliminarCita = async (req, res) => {
    const { id } = req.params;
    try {
        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const pacienteId = cita.paciente;

        // Eliminar la cita
        await Cita.findByIdAndDelete(id);

        // Restar 1 al número de sesiones del paciente
        const paciente = await Paciente.findById(pacienteId);
        if (paciente && paciente.numSesiones > 0) {
            paciente.numSesiones -= 1;
            await paciente.save();
        }

        res.json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};
