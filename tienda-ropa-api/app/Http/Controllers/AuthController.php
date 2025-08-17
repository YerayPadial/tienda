<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validamos los datos con mensajes personalizados
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:1'
        ], [
            'email.required' => 'El email es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña no puede estar vacía',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email o contraseña incorrectos'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        // GENERA EL TOKEN CON SANCTUM
        $token = $user->createToken('web-session')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login exitoso'
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener al menos 2 caracteres',
            'name.max' => 'El nombre no puede exceder 255 caracteres',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'email.unique' => 'Este email ya está registrado',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
        ]);

        try {
            // Sanitizar datos de entrada
            $name = strip_tags(trim($request->name));
            $email = filter_var(trim($request->email), FILTER_SANITIZE_EMAIL);

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => bcrypt($request->password),
            ]);

            // Crear token para auto-login después del registro
            $token = $user->createToken('web-session')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Usuario registrado y logueado correctamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Verificar si hay un usuario autenticado
            $user = $request->user();

            if ($user) {
                $token = $user->currentAccessToken();

                // Verificar que el token existe y no es un TransientToken
                if ($token && !($token instanceof \Laravel\Sanctum\TransientToken)) {
                    // Revocar el token actual
                    $token->delete();

                    return response()->json([
                        'message' => 'Logout exitoso'
                    ]);
                }
            }

            // Si no hay usuario o token, aún consideramos el logout exitoso
            return response()->json([
                'message' => 'Logout exitoso (sin sesión activa)'
            ]);
        } catch (\Exception $e) {
            // En caso de cualquier error, aún devolvemos éxito 
            // porque el objetivo es limpiar la sesión del frontend
            return response()->json([
                'message' => 'Logout completado',
                'note' => 'Sesión limpiada localmente'
            ]);
        }
    }

    // Método para verificar si el usuario está autenticado
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'message' => 'Usuario autenticado'
        ]);
    }
}
