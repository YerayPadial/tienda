<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Employee;
use App\Models\User;

class EmployeeAuthController extends Controller
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

        // Buscar el empleado por email
        $employee = Employee::where('email', $request->email)->first();

        if (!$employee) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Verificar contraseña
        if (!password_verify($request->password, $employee->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Verificar que el empleado esté activo
        if (!$employee->is_active) {
            return response()->json([
                'message' => 'Cuenta de empleado desactivada'
            ], 401);
        }

        // Generar token para el empleado
        $token = $employee->createToken('admin-panel-' . $employee->name)->plainTextToken;

        return response()->json([
            'employee' => $employee,
            'token' => $token,
            'message' => 'Login exitoso'
        ]);
    }

    public function logout(Request $request)
    {
        try {
            // Verificar si hay un empleado autenticado
            $employee = $request->user();

            if ($employee) {
                $token = $employee->currentAccessToken();

                // Verificar que el token existe y no es un TransientToken
                if ($token && !($token instanceof \Laravel\Sanctum\TransientToken)) {
                    // Revocar el token actual
                    $token->delete();

                    return response()->json([
                        'message' => 'Logout exitoso'
                    ]);
                }
            }

            // Si no hay empleado o token válido, aún consideramos el logout exitoso
            return response()->json([
                'message' => 'Logout exitoso (sin sesión activa)'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout completado',
                'note' => 'Sesión limpiada localmente'
            ]);
        }
    }

    // Método para verificar si el empleado está autenticado
    public function me(Request $request)
    {
        return response()->json([
            'employee' => $request->user(),
            'message' => 'Empleado autenticado'
        ]);
    }
}
