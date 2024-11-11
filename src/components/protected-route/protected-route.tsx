import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuth,
  selectIsAppInitialized
} from '../../slices/burgerStoreSlice';
import { Preloader } from '../ui/preloader';
import { useAppSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isAuth = useAppSelector(selectIsAuth);
  const isInit = useAppSelector(selectIsAppInitialized);
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  if (!isInit) return <Preloader />;
  if (!onlyUnAuth && !isAuth)
    return <Navigate replace to='/login' state={{ from: location }} />;
  if (onlyUnAuth && isAuth) return <Navigate replace to={from} />;

  return children;
};
