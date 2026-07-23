import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Header from './components/Header'
import CartSidebar from './components/CartSidebar'
import { UserProvider } from './context/UserContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/ecommerce">
      <UserProvider>
        <CartProvider>
          <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <CartSidebar />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '12px 16px',
                  fontSize: '14px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
              }}
            />
          </div>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
