import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  clearPersonalOrders,
  fetchPersonalOrders,
  selectIsLoading,
  selectPersonalOrders
} from '../../slices/burgerStoreSlice';

const useProfileOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectPersonalOrders);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearPersonalOrders());
      await dispatch(fetchPersonalOrders());
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
