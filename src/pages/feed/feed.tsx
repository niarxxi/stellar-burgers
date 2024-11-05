import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectOrderHistory,
  fetchOrdersFeed,
  clearOrderHistory,
  fetchCatalog
} from '../../slices/burgerStoreSlice';

const useFeedData = () => {
  const orders = useAppSelector(selectOrderHistory);
  const dispatch = useAppDispatch();

  const loadData = async () => {
    await Promise.all([dispatch(fetchCatalog()), dispatch(fetchOrdersFeed())]);
  };

  const refreshFeeds = () => {
    dispatch(clearOrderHistory());
    dispatch(fetchOrdersFeed());
  };

  return { orders, loadData, refreshFeeds };
};

export const Feed: FC = () => {
  const { orders, loadData, refreshFeeds } = useFeedData();

  useEffect(() => {
    loadData();
  }, []);

  if (!orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={refreshFeeds} />;
};
