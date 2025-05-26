import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { logout } from '@/state/slices/authSlice';
import { fetchProducts } from '@/state/slices/productSlice';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, credentials } = useAppSelector((state) => state.auth);
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!user || !credentials) {
      navigate('/');
    }
    dispatch(fetchProducts());
  }, [user, credentials, dispatch]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}!</span>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => {
                dispatch(logout());
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Products</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-blue-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-gray-500">Total products in inventory</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Stock</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-green-500"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {products.reduce((sum, product) => sum + product.stock, 0)}
              </div>
              <p className="text-xs text-gray-500">Total units in stock</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Value</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-yellow-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ${products.reduce((sum, product) => sum + (product.price * product.stock), 0).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">Total inventory value</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.supplier}</p>
                  </div>
                  <div className="pt-2">
                    <div className="text-2xl font-bold">${product.price}</div>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
