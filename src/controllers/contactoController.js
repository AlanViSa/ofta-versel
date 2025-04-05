exports.enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Simular el envío exitoso
    res.status(200).json({
      message: 'Mensaje enviado correctamente',
      data: {
        nombre,
        email,
        telefono,
        mensaje
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
}; 