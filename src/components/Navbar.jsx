import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Inicio', href: '#inicio' },
    { name: '¿Quiénes somos?', href: '#quienes-somos' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Productos', href: '#productos' },
    { name: 'Marcas', href: '#marcas' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    // Cerrar el menú si está abierto
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Obtener el elemento al que queremos desplazarnos
    const element = document.querySelector(href);
    if (element) {
      // Ajustar offset según la sección
      let offset = 120; // Offset predeterminado
      
      // Ajustar offsets específicos para secciones problemáticas
      if (href === '#quienes-somos') {
        offset = 40; // Menor offset para que la sección quede más arriba
      } else if (href === '#contacto') {
        offset = 40; // Menor offset para que la sección quede más arriba
      } else if (href === '#productos') {
        offset = 40; // Menor offset para que la sección quede más arriba
      }
      
      // Calcular la posición del elemento
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      // Desplazamiento suave a la posición ajustada
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="bg-primary fixed w-full z-50 top-8 left-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre de la clínica */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Espacio para el logo */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">IWS</span>
              </div>
              <span className="ml-3 text-white font-display font-semibold text-lg truncate max-w-[180px] md:max-w-xs">
                Clínica Oftalmológica IWS
              </span>
            </div>
          </div>

          {/* Menú de navegación - Escritorio y Tablets grandes */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-white hover:text-accent transition-colors duration-200 px-2 py-1 text-sm xl:text-base whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={(e) => handleNavClick(e, '#contacto')}
              className="ml-2 xl:ml-4 px-3 xl:px-4 py-1 xl:py-2 bg-accent text-white rounded-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 text-sm xl:text-base whitespace-nowrap"
            >
              Agenda tu consulta
            </a>
          </div>

          {/* Botón de menú para móviles y tablets medianas */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-accent"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil y tablets medianas */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-white hover:text-accent transition-colors duration-200 text-center"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex justify-center">
              <a
                href="#contacto"
                className="block px-3 py-2 mt-2 bg-accent text-white text-center rounded-lg hover:bg-white hover:text-primary transition-all duration-300 w-full max-w-xs"
                onClick={(e) => handleNavClick(e, '#contacto')}
              >
                Agenda tu consulta
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 