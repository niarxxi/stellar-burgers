import { ReactNode, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  hideDetails,
  fetchCatalog,
  fetchUserProfile,
  initializeApp,
  selectCatalog,
  selectIsAuth,
  selectIsDetailsVisible,
  selectOrderHistory,
  selectCurrentOrder
} from '../../slices/burgerStoreSlice';
import { getCookie } from '../../utils/cookie';
import { useAppDispatch, useAppSelector } from '../../services/store';

interface ModalWrapperProps {
  title: string;
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, children }) => {
  const dispatch = useAppDispatch();
  return (
    <Modal title={title} onClose={() => dispatch(hideDetails())}>
      {children}
    </Modal>
  );
};

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const modalBackground = location.state?.background;
  const authToken = getCookie('accessToken');
  const isAuth = useAppSelector(selectIsAuth);
  const ingredients = useAppSelector(selectCatalog);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const showModal = useAppSelector(selectIsDetailsVisible);

  useEffect(() => {
    const initApp = async () => {
      if (!isAuth && authToken) {
        await dispatch(fetchUserProfile());
      }
      dispatch(initializeApp());

      if (!ingredients.length) {
        dispatch(fetchCatalog());
      }
    };

    initApp();
  }, [dispatch, isAuth, authToken, ingredients.length]);

  const mainRoutes = useMemo(
    () => (
      <Routes location={modalBackground || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    ),
    [modalBackground, location]
  );

  const modalRoutes = useMemo(
    () =>
      showModal &&
      modalBackground && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalWrapper title='Описание ингредиента'>
                <IngredientDetails />
              </ModalWrapper>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalWrapper
                  title={`Заказ #${currentOrder?.number.toString().padStart(6, '0')}`}
                >
                  <OrderInfo />
                </ModalWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalWrapper
                title={`Заказ #${currentOrder?.number.toString().padStart(6, '0')}`}
              >
                <OrderInfo />
              </ModalWrapper>
            }
          />
        </Routes>
      ),
    [showModal, modalBackground, currentOrder]
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      {mainRoutes}
      {modalRoutes}
    </div>
  );
};
