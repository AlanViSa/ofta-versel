const QuienesSomos = () => {
  const scrollToEquipo = () => {
    const equipoSection = document.getElementById('equipo');
    equipoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="quienes-somos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
            ¿Quiénes Somos?
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen de la clínica */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
              alt="Clínica Oftalmológica IWS"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-2xl font-display font-semibold text-secondary">
              Expertos en Salud Visual
            </h3>
            <p className="text-gray-600">
              En Clínica Oftalmológica IWS, nos dedicamos a proporcionar la más alta calidad 
              en atención oftalmológica. Con años de experiencia y un equipo de profesionales 
              altamente calificados, nos hemos convertido en un referente en el cuidado de la 
              salud visual.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Equipo médico especializado con más de 15 años de experiencia
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Tecnología de última generación para diagnósticos precisos
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Atención personalizada y seguimiento continuo
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <button 
                onClick={scrollToEquipo}
                className="mt-8 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Conoce a Nuestro Equipo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuienesSomos; 