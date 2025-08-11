import React from 'react'

const Register: React.FC = () => {
  return (
    <section className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrarse</h1>
      <form className="flex flex-col gap-4">
        <input
          className="border rounded px-3 py-2"
          type="text"
          placeholder="Nombre"
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="Contraseña"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear cuenta
        </button>
      </form>
    </section>
  )
}

export default Register