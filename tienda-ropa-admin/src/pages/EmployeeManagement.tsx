import React, { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    Alert,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material'
import {
    Add,
    Edit,
    Delete
} from '@mui/icons-material'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/api'

interface Employee {
    id: number
    name: string
    email: string
    rol: string
    is_active: boolean
    created_at: string
}

interface FormErrors {
    name?: string
    email?: string
    password?: string
    rol?: string
}

interface FormData {
    name: string
    email: string
    rol: string
    password: string
    is_active: boolean
}

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        rol: '',
        password: '',
        is_active: true
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [saving, setSaving] = useState(false)

    // Roles disponibles
    const availableRoles = ['admin', 'empleado', 'vendedor', 'gerente']

    // Función para validar email
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Función para validar el formulario
    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        // Validar nombre
        if (!formData.name.trim()) {
            errors.name = 'El nombre es obligatorio'
        } else if (formData.name.trim().length > 255) {
            errors.name = 'El nombre no puede tener más de 255 caracteres'
        }

        // Validar email
        if (!formData.email.trim()) {
            errors.email = 'El email es obligatorio'
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Debe ser un email válido'
        }

        // Validar contraseña
        if (!editingEmployee && !formData.password) {
            errors.password = 'La contraseña es obligatoria'
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        // Validar rol
        if (!formData.rol.trim()) {
            errors.rol = 'El rol es obligatorio'
        } else if (!availableRoles.includes(formData.rol)) {
            errors.rol = 'Debe seleccionar un rol válido'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Función para limpiar errores del formulario
    const clearFormErrors = () => {
        setFormErrors({})
    }

    useEffect(() => {
        loadEmployees()
    }, [])

    const loadEmployees = async () => {
        try {
            setLoading(true)
            setError(null)

            // Cargar empleados reales desde la API
            const response = await getEmployees()
            const employeesData = response.data || response || []
            setEmployees(employeesData)
        } catch (error) {
            console.error('Error loading employees:', error)
            setError('Error al cargar empleados')
        } finally {
            setLoading(false)
        }
    }

    const handleOpenDialog = (employee?: Employee) => {
        if (employee) {
            setEditingEmployee(employee)
            setFormData({
                name: employee.name,
                email: employee.email,
                rol: employee.rol,
                password: '',
                is_active: employee.is_active
            })
        } else {
            setEditingEmployee(null)
            setFormData({
                name: '',
                email: '',
                rol: '',
                password: '',
                is_active: true
            })
        }
        clearFormErrors()
        setError(null)
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setEditingEmployee(null)
        setFormData({
            name: '',
            email: '',
            rol: '',
            password: '',
            is_active: true
        })
        clearFormErrors()
        setError(null)
        setSaving(false)
    }

    const handleSubmit = async () => {
        // Validar formulario antes de enviar
        if (!validateForm()) {
            return
        }

        setSaving(true)
        setError(null)

        try {
            if (editingEmployee) {
                // Editar empleado existente
                await updateEmployee(editingEmployee.id, formData)
            } else {
                // Crear nuevo empleado
                await createEmployee(formData)
            }

            handleCloseDialog()
            await loadEmployees()
        } catch (error: any) {
            console.error('Error saving employee:', error)

            // Manejar errores de validación del servidor
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setFormErrors(error.response.data.errors)
            } else if (error.response?.data?.message) {
                setError(error.response.data.message)
            } else {
                setError('Error al guardar empleado')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (employeeId: number) => {
        const employeeToDelete = employees.find(emp => emp.id === employeeId)
        const confirmMessage = `¿Estás seguro de que quieres eliminar a ${employeeToDelete?.name || 'este empleado'}?`

        if (window.confirm(confirmMessage)) {
            try {
                setError(null)
                await deleteEmployee(employeeId)
                await loadEmployees()
            } catch (error: any) {
                console.error('Error deleting employee:', error)

                if (error.response?.status === 400) {
                    setError(error.response.data.message || 'No se puede eliminar este empleado')
                } else if (error.response?.data?.message) {
                    setError(error.response.data.message)
                } else {
                    setError('Error al eliminar empleado')
                }
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatRole = (role: string) => {
        const roleMap: { [key: string]: string } = {
            'admin': 'Administrador',
            'empleado': 'Empleado',
            'vendedor': 'Vendedor',
            'gerente': 'Gerente'
        }
        return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1)
    }

    const getRoleColor = (role: string): "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default" => {
        const colorMap: { [key: string]: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default" } = {
            'admin': 'error',
            'gerente': 'warning',
            'vendedor': 'info',
            'empleado': 'default'
        }
        return colorMap[role] || 'default'
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Gestión de Empleados
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Nuevo Empleado
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha Registro</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No hay empleados registrados
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>#{employee.id}</TableCell>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={formatRole(employee.rol)}
                                                color={getRoleColor(employee.rol)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={employee.is_active ? 'Activo' : 'Inactivo'}
                                                color={employee.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(employee.created_at)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(employee)}
                                                title="Editar"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(employee.id)}
                                                title="Eliminar"
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog para crear/editar empleado */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value })
                                if (formErrors.name) {
                                    setFormErrors({ ...formErrors, name: undefined })
                                }
                            }}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            required
                        />

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value })
                                if (formErrors.email) {
                                    setFormErrors({ ...formErrors, email: undefined })
                                }
                            }}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            required
                        />

                        <FormControl fullWidth error={!!formErrors.rol} required>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={formData.rol}
                                label="Rol"
                                onChange={(e) => {
                                    setFormData({ ...formData, rol: e.target.value })
                                    if (formErrors.rol) {
                                        setFormErrors({ ...formErrors, rol: undefined })
                                    }
                                }}
                            >
                                {availableRoles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.rol && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                    {formErrors.rol}
                                </Typography>
                            )}
                        </FormControl>

                        <TextField
                            label={editingEmployee ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value })
                                if (formErrors.password) {
                                    setFormErrors({ ...formErrors, password: undefined })
                                }
                            }}
                            error={!!formErrors.password}
                            helperText={formErrors.password || (editingEmployee ? 'Dejar vacío para mantener la contraseña actual' : 'Mínimo 6 caracteres')}
                            required={!editingEmployee}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                            }
                            label="Empleado Activo"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={saving || !formData.name || !formData.email || !formData.rol || (!editingEmployee && !formData.password)}
                        startIcon={saving ? <CircularProgress size={20} /> : null}
                    >
                        {saving ? 'Guardando...' : (editingEmployee ? 'Actualizar' : 'Crear')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EmployeeManagement
