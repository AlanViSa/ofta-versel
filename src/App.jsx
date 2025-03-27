import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import TopBar from './components/TopBar.jsx'
import QuienesSomos from './components/QuienesSomos.jsx'
import NuestroEquipo from './components/NuestroEquipo.jsx'
import Servicios from './components/Servicios.jsx'
import Productos from './components/Productos.jsx'
import Marcas from './components/Marcas.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'

function App() {
  return (
    <div className="bg-light min-h-screen">
      <TopBar />
      <Navbar />
      
      {/* Contenedor principal con padding para el navbar fijo */}
      <main>
        {/* Sección de inicio */}
        <section 
          id="inicio" 
          className="min-h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay oscuro para mejorar la legibilidad */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Contenido */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-center">
              Cuidamos tu salud visual
            </h1>
            <p className="mt-4 text-xl text-white/90 text-center max-w-2xl mx-auto">
              En Clínica Oftalmológica IWS, nos dedicamos a proporcionar la mejor atención 
              para el cuidado de tus ojos con tecnología de vanguardia y profesionales expertos.
            </p>
            <div className="mt-8 flex justify-center">
              <a 
                href="#contacto"
                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 text-lg font-medium transform hover:scale-105 cursor-pointer"
              >
                Agenda tu consulta
              </a>
            </div>
          </div>
        </section>

        {/* Sección Quiénes Somos */}
        <QuienesSomos />

        {/* Sección Nuestro Equipo */}
        <NuestroEquipo />

        {/* Sección Servicios */}
        <Servicios />

        {/* Sección Productos */}
        <Productos />

        {/* Sección Marcas */}
        <Marcas />

        {/* Sección Contacto */}
        <Contacto />

        {/* Las demás secciones se agregarán aquí */}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
