import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaClock, FaShoppingBag } from 'react-icons/fa'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <FaShoppingBag className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Tienda San Juan</h3>
                                    <p className="text-gray-400 text-sm">Moda & Estilo</p>
                                </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Tu destino de moda en San Juan del Puerto. Calidad, estilo y precios justos desde hace años.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors duration-300">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300">
                                    <FaTwitter />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/productos" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        Productos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        Mi Cuenta
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/registro" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        Crear Cuenta
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        Política de Privacidad
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-400">Calle Tonelero</p>
                                        <p className="text-gray-400">San Juan del Puerto, Huelva</p>
                                        <p className="text-gray-400">21610, España</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaPhone className="text-green-500 flex-shrink-0" />
                                    <a href="tel:+34123456789" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        +34 123 456 789
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaEnvelope className="text-purple-500 flex-shrink-0" />
                                    <a href="mailto:info@tiendaropa.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        info@tiendaropa.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Opening Hours */}
                        <div>
                            <h4 className="text-lg font-bold mb-6">Horarios</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FaClock className="text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Lunes - Viernes</p>
                                        <p className="text-gray-400 text-sm">10:00 - 14:00</p>
                                        <p className="text-gray-400 text-sm">17:00 - 20:30</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaClock className="text-yellow-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Sábados</p>
                                        <p className="text-gray-400 text-sm">10:00 - 14:00</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaClock className="text-red-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Domingos</p>
                                        <p className="text-gray-400 text-sm">Cerrado</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Tienda San Juan. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span>Hecho con</span>
                            <FaHeart className="text-red-500 animate-pulse" />
                            <span>en San Juan del Puerto</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
