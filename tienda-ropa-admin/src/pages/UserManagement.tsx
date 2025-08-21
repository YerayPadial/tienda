import { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    TablePagination,
    Tooltip,
    CircularProgress
} from '@mui/material'
import {
    Add,
    Edit,
    Delete,
    Search,
    Person,
    Email,
    CalendarToday,
    ArrowUpward,
    ArrowDownward
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    createColumnHelper,
    flexRender,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type PaginationState
} from '@tanstack/react-table'
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
} from '../services/api'

type User = {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
}

type UserFormData = {
    name: string
    email: string
    password: string
}

const columnHelper = createColumnHelper<User>()

export default function UserManagement() {
    // Estados principales
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Estados del diálogo
    const [openDialog, setOpenDialog] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    // Estados de la tabla
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [totalRows, setTotalRows] = useState(0)

    // Formulario
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

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
                        <Typography variant="body2" fontWeight={500}>
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
                        <Typography variant="body2" color="textSecondary">
                            {info.getValue()}
                        </Typography>
                    </Box>
                ),
            }),
            columnHelper.accessor('email_verified_at', {
                header: 'Verificado',
                cell: (info) => (
                    <Chip
                        label={info.getValue() ? 'Verificado' : 'Sin verificar'}
                        size="small"
                        color={info.getValue() ? 'success' : 'warning'}
                        variant="outlined"
                    />
                ),
            }),
            columnHelper.accessor('created_at', {
                header: 'Registro',
                cell: (info) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday color="action" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                            {new Date(info.getValue()).toLocaleDateString('es-ES')}
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
                        <Tooltip title="Editar usuario">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDialog(info.row.original)}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleOpenDelete(info.row.original.id)}
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
        data: users,
        columns,
        pageCount: Math.ceil(totalRows / pagination.pageSize),
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
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    // Cargar datos
    const fetchUsers = async (isInitial = false) => {
        if (isInitial) {
            setInitialLoading(true)
        } else {
            setLoading(true)
        }

        try {
            const params = {
                page: pagination.pageIndex + 1,
                perPage: pagination.pageSize,
                search: globalFilter,
                sortBy: sorting[0]?.id || 'created_at',
                sortOrder: (sorting[0]?.desc ? 'desc' : 'asc') as 'asc' | 'desc',
            }

            const response = await getUsers(params)
            setUsers(response.data || [])
            setTotalRows(response.pagination?.total || 0)
            setError(null)
        } catch (err: any) {
            setError('Error al cargar usuarios')
            setUsers([])
        }

        if (isInitial) {
            setInitialLoading(false)
        } else {
            setLoading(false)
        }
    }

    // Efectos
    useEffect(() => {
        // Carga inicial
        fetchUsers(true)
    }, [])

    useEffect(() => {
        // Cargas posteriores (sin mostrar spinner inicial)
        if (!initialLoading) {
            fetchUsers()
        }
    }, [pagination, sorting, globalFilter, initialLoading])

    // Handlers del diálogo
    const handleOpenDialog = async (user?: User) => {
        setSuccess(null)
        setError(null)

        if (user) {
            setEditingUser(user)
            try {
                const response = await getUser(user.id)
                const userData = response.data
                reset({
                    name: userData.name,
                    email: userData.email,
                    password: ''
                })
            } catch (err) {
                setError('Error al cargar datos del usuario')
            }
        } else {
            setEditingUser(null)
            reset({
                name: '',
                email: '',
                password: ''
            })
        }
        setOpenDialog(true)
    }

    const handleOpenDelete = (id: number) => {
        setDeleteId(id)
        setDeleteDialog(true)
    }

    // Submit del formulario
    const onSubmit = async (data: UserFormData) => {
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (editingUser) {
                const updateData: any = {
                    name: data.name,
                    email: data.email,
                }
                // Solo incluir password si se proporcionó
                if (data.password) {
                    updateData.password = data.password
                }
                await updateUser(editingUser.id, updateData)
                setSuccess('Usuario actualizado correctamente')
            } else {
                await createUser(data)
                setSuccess('Usuario creado correctamente')
            }
            setOpenDialog(false)
            fetchUsers()
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error al guardar el usuario'
            )
        }
        setLoading(false)
    }

    // Eliminar usuario
    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        try {
            if (deleteId) {
                await deleteUser(deleteId)
                setSuccess('Usuario eliminado correctamente')
                fetchUsers()
            }
            setDeleteDialog(false)
        } catch (err: any) {
            setError('Error al eliminar el usuario')
        }
        setLoading(false)
    }

    return (
        <Box p={3}>
            {/* Carga inicial */}
            {initialLoading ? (
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
                        Cargando clientes...
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" fontWeight={700}>
                            Gestión de Clientes
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                        >
                            Nuevo Cliente
                        </Button>
                    </Stack>

                    {/* Alertas */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* Búsqueda */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por nombre o email..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Paper>

                    {/* Tabla */}
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
                                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                                        userSelect: 'none'
                                                    }}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <Box>
                                                                {header.column.getIsSorted() === 'desc' ? (
                                                                    <ArrowDownward fontSize="small" />
                                                                ) : header.column.getIsSorted() === 'asc' ? (
                                                                    <ArrowUpward fontSize="small" />
                                                                ) : null}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">
                                                <Typography>Cargando...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">
                                                <Typography color="textSecondary">
                                                    No se encontraron usuarios
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
                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={pagination.pageIndex}
                            onPageChange={(_, newPage) =>
                                setPagination(prev => ({ ...prev, pageIndex: newPage }))
                            }
                            rowsPerPage={pagination.pageSize}
                            onRowsPerPageChange={(e) =>
                                setPagination(prev => ({
                                    ...prev,
                                    pageSize: parseInt(e.target.value, 10),
                                    pageIndex: 0
                                }))
                            }
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                        />
                    </Paper>

                    {/* Diálogo Crear/Editar */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            {editingUser ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </DialogTitle>
                        <DialogContent>
                            <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3} sx={{ mt: 1 }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'El nombre es obligatorio' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nombre completo"
                                                fullWidth
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: 'El email es obligatorio',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email inválido'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: editingUser ? false : 'La contraseña es obligatoria',
                                            minLength: {
                                                value: 8,
                                                message: 'La contraseña debe tener al menos 8 caracteres'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                                                type="password"
                                                fullWidth
                                                error={!!errors.password}
                                                helperText={errors.password?.message || (editingUser ? 'Deja vacío para mantener la contraseña actual' : '')}
                                            />
                                        )}
                                    />
                                </Stack>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                form="user-form"
                                variant="contained"
                                disabled={loading}
                            >
                                {editingUser ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo Eliminar */}
                    <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                        <DialogTitle>Eliminar Cliente</DialogTitle>
                        <DialogContent>
                            <Typography>
                                ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialog(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDelete}
                                color="error"
                                variant="contained"
                                disabled={loading}
                            >
                                Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    )
}
