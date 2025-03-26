const Marcas = () => {
  const marcas = [
    {
      nombre: "Essilor",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Essilor_logo.svg/2560px-Essilor_logo.svg.png",
      descripcion: "Líder mundial en lentes oftálmicos"
    },
    {
      nombre: "Zeiss",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Zeiss_logo.svg/2560px-Zeiss_logo.svg.png",
      descripcion: "Tecnología óptica de precisión"
    },
    {
      nombre: "Hoya",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Hoya_Corporation_logo.svg/2560px-Hoya_Corporation_logo.svg.png",
      descripcion: "Innovación en materiales ópticos"
    },
    {
      nombre: "Rodenstock",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Rodenstock_logo.svg/2560px-Rodenstock_logo.svg.png",
      descripcion: "Calidad alemana en óptica"
    },
    {
      nombre: "Transitions",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Transitions_Optical_logo.svg/2560px-Transitions_Optical_logo.svg.png",
      descripcion: "Lentes fotocromáticas"
    }
  ];

  return (
    <section id="marcas" className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Marcas con las que Trabajamos
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-secondary max-w-2xl mx-auto">
            Trabajamos con las mejores marcas del mercado para garantizar la más alta 
            calidad en nuestros productos y servicios.
          </p>
        </div>

        {/* Grid de marcas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {marcas.map((marca, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img 
                  src={marca.logo}
                  alt={`Logo de ${marca.nombre}`}
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {marca.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  {marca.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marcas; 