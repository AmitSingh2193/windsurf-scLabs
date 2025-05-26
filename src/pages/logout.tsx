import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../state/hooks';
import { logout } from '../state/slices/authSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  dispatch(logout());
  navigate('/');

  return null;
};

export default Logout;
