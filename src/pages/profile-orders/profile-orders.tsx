import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  fetchCatalog,
  fetchPersonalOrders,
  clearPersonalOrders,
  selectPersonalOrders,
  selectIsLoading
} from '../../slices/burgerStoreSlice';
import { useAppSelector, useAppDispatch } from '../../services/store';

const useProfileOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectPersonalOrders);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearPersonalOrders());
      await Promise.all([
        dispatch(fetchCatalog()),
        dispatch(fetchPersonalOrders())
      ]);
    };

    fetchData();

    return () => {
      dispatch(clearPersonalOrders());
    };
  }, [dispatch]);

  return { orders, isLoading };
};

export const ProfileOrders: FC = () => {
  const { orders, isLoading } = useProfileOrders();

  if (isLoading || !orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
