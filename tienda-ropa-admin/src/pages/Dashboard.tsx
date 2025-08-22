import React, { useState, useEffect } from 'react'
import {
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material'
import {
    People,
    Inventory,
    ShoppingCart,
    TrendingUp
} from '@mui/icons-material'
import { useEmployee } from '../context/EmployeeContext'
import { getEmployees, getProducts, getUsers, getOrders } from '../services/api'

interface DashboardStats {
    totalEmployees: number
    totalProducts: number
    totalUsers: number
    totalOrders: number
    recentOrders: Array<{
        id: number
        user_id: string
        calculated_total: string
        status: string
        created_at: string
        user?: {
            id: number
            name: string
            email: string
        }
    }>
    users: Array<{
        id: number
        name: string
        email: string
    }>
}

const Dashboard: React.FC = () => {
    const { employee } = useEmployee()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Cargar datos reales desde las APIs
            const [employeesRes, productsRes, usersRes, ordersRes] = await Promise.all([
                getEmployees().catch(() => ({ data: [] })),
                getProducts().catch(() => ({ data: [] })),
                getUsers().catch(() => ({ data: [] })),
                getOrders().catch(() => ({ data: [] }))
            ])

            // Extraer los datos de las respuestas
            const employees = employeesRes.data || employeesRes || []
            const products = productsRes.data || productsRes || []
            const users = usersRes.data || usersRes || []
            const orders = ordersRes.data || ordersRes || []

            // Obtener los 5 pedidos más recientes
            const recentOrders = Array.isArray(orders)
                ? orders
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                : []

            const dashboardStats: DashboardStats = {
                totalEmployees: Array.isArray(employees) ? employees.length : 0,
                totalProducts: Array.isArray(products) ? products.length : 0,
                totalUsers: Array.isArray(users) ? users.length : 0,
                totalOrders: Array.isArray(orders) ? orders.length : 0,
                recentOrders: recentOrders,
                users: Array.isArray(users) ? users : []
            }

            setStats(dashboardStats)
        } catch (error) {
            console.error('Error loading dashboard data:', error)
            setError('Error al cargar los datos del dashboard')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success'
            case 'processing':
                return 'warning'
            case 'pending':
                return 'info'
            case 'cancelled':
                return 'error'
            default:
                return 'default'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completado'
            case 'processing':
                return 'Procesando'
            case 'pending':
                return 'Pendiente'
            case 'cancelled':
                return 'Cancelado'
            default:
                return status
        }
    }

    const getUserName = (userId: string | number, order?: any) => {
        // Primero intentar usar la relación user del pedido si está disponible
        if (order?.user?.name) {
            return order.user.name
        }

        // Si no, buscar en la lista de usuarios cargada
        if (!stats?.users) return `Usuario #${userId}`

        const user = stats.users.find(u => u.id.toString() === userId.toString())
        return user ? user.name : `Usuario #${userId}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        )
    }

    const statCards = [
        {
            title: 'Empleados',
            value: stats?.totalEmployees || 0,
            icon: <People fontSize="large" />,
            color: '#1976d2'
        },
        {
            title: 'Productos',
            value: stats?.totalProducts || 0,
            icon: <Inventory fontSize="large" />,
            color: '#388e3c'
        },
        {
            title: 'Usuarios',
            value: stats?.totalUsers || 0,
            icon: <People fontSize="large" />,
            color: '#f57c00'
        },
        {
            title: 'Pedidos',
            value: stats?.totalOrders || 0,
            icon: <ShoppingCart fontSize="large" />,
            color: '#7b1fa2'
        }
    ]

    return (
        <Box>
            {/* Bienvenida */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Bienvenido/a, {employee?.name}
                </Typography>
            </Box>

            {/* Estadísticas */}
            <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 4 }}>
                {statCards.map((card, index) => (
                    <Card key={index} sx={{ minWidth: 200, flex: 1 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box sx={{ color: card.color }}>
                                    {card.icon}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Pedidos Recientes */}
            <Paper sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUp sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Pedidos Recientes
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{getUserName(order.user_id, order)}</TableCell>
                                        <TableCell>€{order.calculated_total}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusText(order.status)}
                                                color={getStatusColor(order.status) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(order.created_at)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No hay pedidos recientes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}

export default Dashboard
