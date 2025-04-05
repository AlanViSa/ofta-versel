import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Plantillas de correo
export const emailTemplates = {
  storageAlert: (stats) => ({
    subject: 'Alerta de Almacenamiento de Imágenes',
    html: `
      <h2>Alerta de Almacenamiento</h2>
      <p>Se ha detectado un uso alto de almacenamiento en el sistema de imágenes:</p>
      <ul>
        <li>Total de imágenes: ${stats.totalImages}</li>
        <li>Imágenes no utilizadas: ${stats.unusedImages}</li>
        <li>Tamaño total: ${(stats.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB</li>
        <li>Tamaño promedio: ${(stats.averageSize / (1024 * 1024)).toFixed(2)} MB</li>
      </ul>
      <p>Por favor, revise el sistema y realice una limpieza si es necesario.</p>
    `
  }),
  cleanupReport: (result) => ({
    subject: 'Reporte de Limpieza de Imágenes',
    html: `
      <h2>Reporte de Limpieza de Imágenes</h2>
      <p>Se ha completado la limpieza automática de imágenes:</p>
      <ul>
        <li>Imágenes eliminadas: ${result.total}</li>
        <li>Lista de imágenes eliminadas:</li>
        <ul>
          ${result.deleted.map(id => `<li>${id}</li>`).join('')}
        </ul>
      </ul>
    `
  }),
  taskStatus: (taskName, status) => ({
    subject: `Estado de Tarea: ${taskName}`,
    html: `
      <h2>Actualización de Estado de Tarea</h2>
      <p>La tarea "${taskName}" ha sido ${status ? 'habilitada' : 'deshabilitada'}.</p>
      <p>Por favor, verifique la configuración del sistema.</p>
    `
  })
};

// Función para enviar correo
export const sendEmail = async (to, template, data) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      ...emailTemplates[template](data)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente a ${to}`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};

// Función para enviar notificación a administradores
export const notifyAdmins = async (template, data) => {
  try {
    const adminEmails = process.env.ADMIN_EMAILS.split(',');
    await Promise.all(adminEmails.map(email => sendEmail(email, template, data)));
  } catch (error) {
    console.error('Error al enviar notificaciones a administradores:', error);
    throw error;
  }
}; 