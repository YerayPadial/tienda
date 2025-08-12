<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ProfileController extends Controller
{
    // Obtener el perfil del usuario por id (para uso sin autenticación, prox cambio)
    public function show(Request $request)
    {
        $userId = $request->query('id') ?? $request->input('id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        return response()->json(['user' => $user]);
    }

    // Actualizar nombre y/o email
    public function update(Request $request)
    {
        $userId = $request->input('id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'name' => ['required', 'string', 'min:2'],
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
        ], [
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener al menos 2 caracteres',
            'email.required' => 'El email es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'email.unique' => 'Este email ya está registrado por otro usuario',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }

    // Actualizar solo el nombre
    public function updateName(Request $request)
    {
        $userId = $request->input('id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'name' => ['required', 'string', 'min:2'],
        ], [
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener al menos 2 caracteres',
        ]);

        $user->name = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Nombre actualizado correctamente',
            'user' => $user
        ]);
    }

    // Actualizar solo el email
    public function updateEmail(Request $request)
    {
        $userId = $request->input('id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
        ], [
            'email.required' => 'El email es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'email.unique' => 'Este email ya está registrado por otro usuario',
        ]);

        $user->email = $request->email;
        $user->save();

        return response()->json([
            'message' => 'Email actualizado correctamente',
            'user' => $user
        ]);
    }

    // Cambiar la contraseña
    public function changePassword(Request $request)
    {
        $userId = $request->input('id');
        $user = User::find($userId);
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|string|min:8',
        ], [
            'currentPassword.required' => 'La contraseña actual es obligatoria',
            'newPassword.required' => 'La nueva contraseña es obligatoria',
            'newPassword.min' => 'La nueva contraseña debe tener al menos 8 caracteres',
        ]);

        // Verifica la contraseña actual
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'La contraseña actual es incorrecta'], 400);
        }

        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
