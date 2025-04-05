const Productos = () => {
  const productos = [
    {
      nombre: "Lentes Monofocales",
      descripcion: "Corrección precisa para una distancia específica, ideales para uso general.",
      caracteristicas: [
        "Corrección de miopía o hipermetropía",
        "Óptima visión a una distancia",
        "Diseño delgado y ligero",
        "Gran variedad de materiales"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      nombre: "Lentes Bifocales",
      descripcion: "Dos zonas de visión en un solo lente: lejos y cerca.",
      caracteristicas: [
        "Visión clara a dos distancias",
        "Perfectos para presbicia",
        "Transición definida",
        "Fáciles de adaptar"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      nombre: "Lentes Progresivos",
      descripcion: "Transición suave entre todas las distancias sin líneas visibles.",
      caracteristicas: [
        "Visión natural en todas las distancias",
        "Sin líneas divisorias",
        "Diseño estético",
        "Adaptación personalizada"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      nombre: "Lentes Fotocromáticos",
      descripcion: "Se adaptan automáticamente a la luz solar, protegiendo tus ojos.",
      caracteristicas: [
        "Adaptación automática a la luz",
        "Protección UV integrada",
        "Transición suave",
        "Versatilidad total"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      nombre: "Lentes Antirreflejantes",
      descripcion: "Eliminan reflejos molestos y mejoran la visión nocturna.",
      caracteristicas: [
        "Reducción de deslumbramiento",
        "Mejor visión nocturna",
        "Más estéticos",
        "Fáciles de limpiar"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      nombre: "Lentes Blue Light",
      descripcion: "Protección especial contra la luz azul de dispositivos digitales.",
      caracteristicas: [
        "Protección contra luz azul",
        "Reducción de fatiga visual",
        "Ideal para pantallas",
        "Máxima comodidad"
      ],
      imagen: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="productos" className="py-20 bg-white" style={{ scrollMarginTop: '40px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Nuestros Productos
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-secondary max-w-2xl mx-auto">
            Ofrecemos una amplia gama de lentes de alta calidad, diseñados para 
            satisfacer todas tus necesidades visuales con la mejor tecnología disponible.
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto, index) => (
            <div 
              key={index}
              className="bg-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Imagen del producto */}
              <div className="relative h-48">
                <img 
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información del producto */}
              <div className="p-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-primary mb-2">{producto.nombre}</h3>
                  <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                  <button className="text-accent hover:text-secondary transition-colors duration-300">
                    Más información →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Productos; 