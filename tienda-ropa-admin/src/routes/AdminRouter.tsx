import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EmployeeProvider } from '../context/EmployeeContext'
import AdminLayout from '../components/AdminLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminLogin from '../pages/AdminLogin'
import Dashboard from '../pages/Dashboard'
import EmployeeManagement from '../pages/EmployeeManagement'

export const adminRouter = createBrowserRouter([
  {
    path: '/admin/login',
    element: (
      <EmployeeProvider>
        <AdminLogin />
      </EmployeeProvider>
    )
  },
  {
    path: '/admin',
    element: (
      <EmployeeProvider>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </EmployeeProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'employees',
        element: <EmployeeManagement />
      },
      {
        path: 'products',
        element: <div>Productos - En desarrollo</div>
      },
      {
        path: 'clients',
        element: <div>Clientes - En desarrollo</div>
      },
      {
        path: 'orders',
        element: <div>Pedidos - En desarrollo</div>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/admin/login" replace />
  }
], {
  basename: '/panelTienda'
})

export default adminRouter
