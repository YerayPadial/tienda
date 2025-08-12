import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaBoxOpen } from 'react-icons/fa'

type User = {
    name: string
    email: string
}

type UserMenuProps = {
    user: User
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const navigate = useNavigate()

    const cards = [
        {
            title: 'Perfil',
            description: 'Edita tu información personal.',
            icon: <FaUserCircle className="text-blue-500 text-6xl mb-4" />,
            onClick: () => navigate('/perfil')
        },
        {
            title: 'Pedidos',
            description: 'Consulta y gestiona tus pedidos.',
            icon: <FaBoxOpen className="text-green-500 text-6xl mb-4" />,
            onClick: () => navigate('/pedidos')
        },
    ]
    /* 
       const handleLogout = async () => {
            // Limpiar datos del usuario del localStorage
            localStorage.removeItem('user')
            alert('Has cerrado sesión exitosamente')
            navigate('/login')
        }
    */
    return (
        <section className="flex flex-col items-center gap-8 py-10">
            <div className="bg-white shadow-lg rounded-xl px-8 py-6 w-full max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-2">¡Hola, {user.name}!</h1>
                <p className="text-lg text-gray-600 mb-6">Bienvenido a tu espacio personal.</p>
                <div className="flex flex-col md:flex-row gap-8 justify-center">
                    {cards.map(card => (
                        <div
                            key={card.title}
                            className="flex-1 bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6 flex flex-col items-center hover:bg-blue-100"
                            onClick={card.onClick}
                        >
                            {card.icon}
                            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                            <p className="text-gray-700">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default UserMenu