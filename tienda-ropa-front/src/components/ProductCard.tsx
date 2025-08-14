import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }: { product: any }) => {
  const navigate = useNavigate()
  return (
    <div
      className="shadow-lg rounded-lg overflow-hidden cursor-pointer"
      onClick={() => navigate(`/productos/${product.id}`)}
    >
      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-gray-500">${product.price}</p>
      </div>
    </div>
  )
}
export default ProductCard