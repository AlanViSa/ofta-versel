import { useState } from 'react'

const NuestroEquipo = () => {
  // Datos de ejemplo del equipo médico
  const equipo = [
    {
      nombre: "Dr. Juan Pérez",
      especialidad: "Oftalmólogo General",
      imagen: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2070&auto=format&fit=crop",
      descripcion: "Especialista con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades oculares."
    },
    {
      nombre: "Dra. María García",
      especialidad: "Especialista en Retina",
      imagen: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
      descripcion: "Experta en el tratamiento de enfermedades de la retina y mácula, con certificación internacional."
    },
    {
      nombre: "Dr. Carlos Rodríguez",
      especialidad: "Cirugía Refractiva",
      imagen: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
      descripcion: "Pionero en técnicas de cirugía láser y corrección de defectos refractivos."
    }
  ]

  return (
    <section id="equipo" className="py-20 bg-light" style={{ scrollMarginTop: '40px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Nuestro Equipo Médico
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
          <p className="mt-6 text-lg text-secondary max-w-2xl mx-auto">
            Contamos con un equipo de profesionales altamente calificados, 
            comprometidos con tu salud visual y el mejor servicio.
          </p>
        </div>

        {/* Grid de médicos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipo.map((medico, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Imagen del médico */}
              <div className="relative h-64">
                <img 
                  src={medico.imagen}
                  alt={medico.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información del médico */}
              <div className="p-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-primary">{medico.nombre}</h3>
                  <p className="text-accent mt-1">{medico.especialidad}</p>
                  <p className="text-gray-600 mt-2">{medico.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NuestroEquipo 