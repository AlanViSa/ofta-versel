import { useState } from 'react';
import axios from 'axios';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    tipoConsulta: '',
    mensaje: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, formData);
      setStatus({ loading: false, error: null, success: true });
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        fecha: '',
        hora: '',
        tipoConsulta: '',
        mensaje: ''
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Error al agendar la cita',
        success: false
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Agenda tu Cita
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-secondary max-w-2xl mx-auto">
            Completa el formulario para agendar tu consulta. Nos pondremos en contacto contigo 
            para confirmar tu cita.
          </p>
        </div>

        {/* Grid superior con formulario e información de contacto */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Formulario de cita - Lado izquierdo */}
          <div>
            <h3 className="text-2xl font-display font-semibold text-primary mb-6 text-center md:text-left">
              Formulario de Cita
            </h3>
            {status.success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                ¡Tu cita ha sido agendada exitosamente! Nos pondremos en contacto contigo pronto.
              </div>
            )}
            {status.error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {status.error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                  Fecha de la cita
                </label>
                <input
                  type="date"
                  name="fecha"
                  id="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                  Hora de la cita
                </label>
                <input
                  type="time"
                  name="hora"
                  id="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="tipoConsulta" className="block text-sm font-medium text-gray-700">
                  Tipo de consulta
                </label>
                <select
                  name="tipoConsulta"
                  id="tipoConsulta"
                  value={formData.tipoConsulta}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                  required
                >
                  <option value="">Selecciona un tipo de consulta</option>
                  <option value="consultaGeneral">Consulta General</option>
                  <option value="examenOcular">Examen Ocular</option>
                  <option value="lentes">Adaptación de Lentes</option>
                  <option value="urgente">Consulta Urgente</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
                  Mensaje adicional (opcional)
                </label>
                <textarea
                  name="mensaje"
                  id="mensaje"
                  rows="4"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-white"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status.loading}
                  className={`w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    status.loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status.loading ? 'Agendando...' : 'Agendar Cita'}
                </button>
              </div>
            </form>
          </div>

          {/* Información de contacto - Lado derecho */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-display font-semibold text-primary mb-6 text-center md:text-left">
              Información de Contacto
            </h3>
            <div className="space-y-4 flex-grow flex flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-2 md:mb-0">
                  <svg className="w-6 h-6 text-accent mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="md:ml-4">
                  <h4 className="text-lg font-medium text-primary">Dirección</h4>
                  <p className="mt-1 text-gray-600">
                    Av. Principal #123<br />
                    Ciudad, Estado 12345
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-2 md:mb-0">
                  <svg className="w-6 h-6 text-accent mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="md:ml-4">
                  <h4 className="text-lg font-medium text-primary">Teléfono</h4>
                  <p className="mt-1 text-gray-600">
                    (123) 456-7890
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-2 md:mb-0">
                  <svg className="w-6 h-6 text-accent mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="md:ml-4">
                  <h4 className="text-lg font-medium text-primary">Email</h4>
                  <p className="mt-1 text-gray-600">
                    contacto@clinicaiws.com
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="flex-shrink-0 mb-2 md:mb-0">
                  <svg className="w-6 h-6 text-accent mx-auto md:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="md:ml-4">
                  <h4 className="text-lg font-medium text-primary">Horario de Atención</h4>
                  <p className="mt-1 text-gray-600">
                    Lunes a Viernes: 9:00 AM - 7:00 PM<br />
                    Sábados: 9:00 AM - 2:00 PM<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de ubicación - Centrado debajo */}
        <div className="w-full">
          <h3 className="text-2xl font-display font-semibold text-primary mb-6 text-center">
            Ubicación
          </h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986532962815!3d40.69714941680809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNueva%20York%2C%20NY%2C%20EE.%20UU.!5e0!3m2!1ses!2s!4v1641234567890!5m2!1ses!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto; 