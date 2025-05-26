import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks';

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Your Orders</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <p className="text-gray-600">Your order history will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
