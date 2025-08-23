import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
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
    InputLabel,
    Stack,
    Tooltip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material'
import {
    Add,
    Edit,
    Delete,
    ArrowUpward,
    ArrowDownward,
    Search,
    Person,
    Email,
    CalendarToday
} from '@mui/icons-material'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type PaginationState
} from '@tanstack/react-table'
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

const columnHelper = createColumnHelper<Employee>()

const EmployeeManagement: React.FC = () => {
    // Estados principales
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

    // Estados de la tabla
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    // Roles disponibles
    const availableRoles = ['admin', 'empleado', 'vendedor', 'gerente']

    // Definición de columnas
    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                size: 80,
                cell: (info) => (
                    <Chip
                        label={`#${info.getValue()}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                ),
            }),
            columnHelper.accessor('name', {
                header: 'Nombre',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Person color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                            {info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('email', {
                header: 'Email',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Email color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('rol', {
                header: 'Rol',
                cell: (info) => {
                    const role = info.getValue()
                    return (
                        <Chip
                            label={formatRole(role)}
                            size="small"
                            color={getRoleColor(role)}
                            variant="filled"
                        />
                    )
                },
            }),
            columnHelper.accessor('is_active', {
                header: 'Estado',
                cell: (info) => (
                    <Chip
                        label={info.getValue() ? 'Activo' : 'Inactivo'}
                        size="small"
                        color={info.getValue() ? 'success' : 'error'}
                        variant="outlined"
                    />
                ),
            }),
            columnHelper.accessor('created_at', {
                header: 'Fecha Registro',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(info.getValue())}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Acciones',
                size: 120,
                cell: (info) => (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar empleado">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(info.row.original)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar empleado">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(info.row.original.id)}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                ),
            }),
        ],
        []
    )

    // Configuración de la tabla
    const table = useReactTable({
        data: employees,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
    })

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
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="50vh"
                gap={2}
            >
                <CircularProgress size={48} />
                <Typography variant="h6" color="textSecondary">
                    Cargando empleados...
                </Typography>
            </Box>
        )
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={700}>
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

            {/* Controles de filtros y búsqueda */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        placeholder="Buscar empleados..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 250 }}
                        slotProps={{
                            input: {
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value)
                                table.getColumn('rol')?.setFilterValue(e.target.value || undefined)
                            }}
                            label="Rol"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {formatRole(role)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                table.getColumn('is_active')?.setFilterValue(
                                    e.target.value === '' ? undefined : e.target.value === 'true'
                                )
                            }}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="true">Activos</MenuItem>
                            <MenuItem value="false">Inactivos</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ ml: 'auto' }}>
                        <Typography variant="body2" color="text.secondary">
                            {table.getFilteredRowModel().rows.length} de {employees.length} empleados
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Tabla con TanStack React Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            sx={{
                                                width: header.getSize(),
                                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                userSelect: 'none',
                                            }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {header.isPlaceholder ? null : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Box display="flex" flexDirection="column">
                                                        {header.column.getIsSorted() === 'asc' && (
                                                            <ArrowUpward fontSize="small" />
                                                        )}
                                                        {header.column.getIsSorted() === 'desc' && (
                                                            <ArrowDownward fontSize="small" />
                                                        )}
                                                        {!header.column.getIsSorted() && (
                                                            <ArrowUpward
                                                                fontSize="small"
                                                                sx={{ opacity: 0.3 }}
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={table.getVisibleLeafColumns().length} align="center">
                                        <Typography variant="body2" color="text.secondary" py={4}>
                                            {globalFilter || roleFilter || statusFilter
                                                ? 'No se encontraron empleados con los filtros aplicados'
                                                : 'No hay empleados registrados'
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} hover>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Paginación */}
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" color="text.secondary">
                            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                            >
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <MenuItem key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="body2" color="text.secondary">
                            por página
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Primera
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Siguiente
                        </Button>
                        <Button
                            size="small"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            Última
                        </Button>
                    </Stack>
                </Box>
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
