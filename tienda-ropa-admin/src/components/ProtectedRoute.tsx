import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useEmployee } from '../context/EmployeeContext'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { employee, loading } = useEmployee()
    const location = useLocation()

    if (loading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                gap={2}
            >
                <CircularProgress />
                <Typography variant="body2" color="textSecondary">
                    Verificando autenticación...
                </Typography>
            </Box>
        )
    }

    if (!employee) {
        // Redirigir al login manteniendo la ruta que intentaba acceder
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
