<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Mostrar todos los empleados
     */
    public function index()
    {
        try {
            $employees = Employee::orderBy('created_at', 'desc')->get();

            return response()->json([
                'data' => $employees,
                'message' => 'Empleados obtenidos exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener empleados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un empleado específico
     */
    public function show($id)
    {
        try {
            $employee = Employee::findOrFail($id);

            return response()->json([
                'data' => $employee,
                'message' => 'Empleado obtenido exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Empleado no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear un nuevo empleado
     */
    public function store(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:employees,email',
                'password' => 'required|string|min:6',
                'rol' => 'required|string|max:255',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'Debe ser un email válido',
                'email.unique' => 'Este email ya está registrado',
                'password.required' => 'La contraseña es obligatoria',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'rol.required' => 'El rol es obligatorio'
            ]);

            // Crear el empleado-----
            $employee = Employee::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'rol' => $validatedData['rol'],
                'is_active' => $validatedData['is_active'] ?? true
            ]);

            return response()->json([
                'data' => $employee,
                'message' => 'Empleado creado exitosamente'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear empleado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar un empleado existente
     */
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            // Validar los datos de entrada
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'email',
                    Rule::unique('employees')->ignore($employee->id)
                ],
                'password' => 'nullable|string|min:6',
                'rol' => 'required|string|max:255',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'El nombre es obligatorio',
                'email.required' => 'El email es obligatorio',
                'email.email' => 'Debe ser un email válido',
                'email.unique' => 'Este email ya está registrado',
                'password.min' => 'La contraseña debe tener al menos 6 caracteres',
                'rol.required' => 'El rol es obligatorio'
            ]);

            // Preparar datos para actualizar
            $updateData = [
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'rol' => $validatedData['rol'],
                'is_active' => $validatedData['is_active'] ?? $employee->is_active
            ];

            // Solo actualizar contraseña si se proporciona
            if (!empty($validatedData['password'])) {
                $updateData['password'] = Hash::make($validatedData['password']);
            }

            // Actualizar el empleado
            $employee->update($updateData);

            return response()->json([
                'data' => $employee->fresh(), // Recargar datos actualizados
                'message' => 'Empleado actualizado exitosamente'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar empleado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar un empleado
     */
    public function destroy($id)
    {
        try {
            $employee = Employee::findOrFail($id);

            // Verificar que no sea el único administrador activo
            if ($employee->rol === 'admin' && $employee->is_active) {
                $activeAdmins = Employee::where('rol', 'admin')
                    ->where('is_active', true)
                    ->where('id', '!=', $id)
                    ->count();

                if ($activeAdmins === 0) {
                    return response()->json([
                        'message' => 'No se puede eliminar el último administrador activo'
                    ], 400);
                }
            }

            $employee->delete();

            return response()->json([
                'message' => 'Empleado eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar empleado',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
