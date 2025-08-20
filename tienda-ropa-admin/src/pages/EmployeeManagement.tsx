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
    CircularProgress
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

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rol: '',
        password: '',
        is_active: true
    })

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
    }

    const handleSubmit = async () => {
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
        } catch (error) {
            console.error('Error saving employee:', error)
            setError('Error al guardar empleado')
        }
    }

    const handleDelete = async (employeeId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            try {
                await deleteEmployee(employeeId)
                await loadEmployees()
            } catch (error) {
                console.error('Error deleting employee:', error)
                setError('Error al eliminar empleado')
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
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>#{employee.id}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.rol}</TableCell>
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
                            ))}
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
                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            label="Rol"
                            variant="outlined"
                            fullWidth
                            value={formData.rol}
                            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                        />
                        <TextField
                            label={editingEmployee ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    <Button onClick={handleCloseDialog}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name || !formData.email || !formData.rol || (!editingEmployee && !formData.password)}
                    >
                        {editingEmployee ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EmployeeManagement
