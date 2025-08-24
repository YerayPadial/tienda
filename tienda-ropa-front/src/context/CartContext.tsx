import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'
import type { CartItem, CartContextType } from '../types/cart'

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload
      const itemId = `${newItem.product_id}-${newItem.size_id}-${newItem.color_id}`
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId)
      
      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex]
        const newQuantity = existingItem.quantity + newItem.quantity
        
        if (newQuantity > existingItem.stock_available) {
          toast.error(`Solo hay ${existingItem.stock_available} unidades disponibles`, {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
            },
          })
          return state
        }
        
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        }
        
        toast.success(`Cantidad actualizada: ${newQuantity} unidades`, {
          duration: 3000,
          style: {
            background: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
          },
        })
        return { ...state, items: updatedItems }
      } else {
        const cartItem: CartItem = {
          ...newItem,
          id: itemId
        }
        
        toast.success(`${newItem.product_name} añadido al carrito`, {
          duration: 3000,
          style: {
            background: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
          },
        })
        return { ...state, items: [...state.items, cartItem] }
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      toast.success('Producto eliminado del carrito', {
        duration: 3000,
        style: {
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        },
      })
      return { ...state, items: updatedItems }
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== id)
        toast.success('Producto eliminado del carrito', {
          duration: 3000,
          style: {
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
        })
        return { ...state, items: updatedItems }
      }
      
      const updatedItems = state.items.map(item => {
        if (item.id === id) {
          if (quantity > item.stock_available) {
            toast.error(`Solo hay ${item.stock_available} unidades disponibles`, {
              duration: 4000,
              style: {
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA',
              },
            })
            return item
          }
          return { ...item, quantity }
        }
        return item
      })
      
      return { ...state, items: updatedItems }
    }
    
    case 'CLEAR_CART':
      toast.success('Carrito vaciado', {
        duration: 3000,
        style: {
          background: '#FEF2F2',
          color: '#DC2626',
          border: '1px solid #FECACA',
        },
      })
      return { ...state, items: [] }
    
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
  })

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const removeFromCart = (productId: number, size?: string, color?: string) => {
    // Generar el ID único basado en el productId, size y color
    const itemId = `${productId}-${size || 'nosize'}-${color || 'nocolor'}`
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = state.items.reduce((total, item) => total + (item.product_price * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart
      }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
