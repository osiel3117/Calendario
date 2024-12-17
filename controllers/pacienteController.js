const Paciente = require('../models/pacienteModel');
const Cita = require('../models/citasModel');

exports.crearPaciente = async (req, res) => {
    const { nombre, telefono, correo } = req.body;
    try {
        // Crear el objeto solo con los campos que no están vacíos
        const nuevoPaciente = new Paciente({
            nombre,
            ...(telefono && { telefono }),
            ...(correo && { correo })
        });

        await nuevoPaciente.save();
        res.status(201).json({ message: 'Paciente creado exitosamente', paciente: nuevoPaciente });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el paciente' });
    }
};


// Obtener todos los pacientes
exports.obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los pacientes' });
    }
};

// Obtener un paciente por ID
exports.obtenerPacientePorId = async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await Paciente.findById(id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(paciente);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el paciente' });
    }
};

// Editar un paciente
exports.editarPaciente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo } = req.body;
    try {
        const paciente = await Paciente.findById(id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Actualizar los datos
        paciente.nombre = nombre || paciente.nombre;
        paciente.telefono = telefono || paciente.telefono;
        paciente.correo = correo || paciente.correo;

        await paciente.save();
        res.status(200).json({ message: 'Paciente actualizado exitosamente', paciente });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el paciente' });
    }
};

// Eliminar un paciente y todas sus citas asociadas
exports.eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si el paciente existe
        const paciente = await Paciente.findById(id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Eliminar todas las citas asociadas al paciente
        await Cita.deleteMany({ paciente: id });

        // Eliminar el paciente
        await Paciente.findByIdAndDelete(id);

        res.status(200).json({ message: 'Paciente y sus citas eliminados exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el paciente y sus citas' });
    }
};
