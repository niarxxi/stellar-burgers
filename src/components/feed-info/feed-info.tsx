import { FC } from 'react';
import {
  selectOrderHistory,
  selectOrderStats
} from '../../slices/burgerStoreSlice';
import { useAppSelector } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useAppSelector(selectOrderHistory);
  const stats = useAppSelector(selectOrderStats);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{
        total: stats.total,
        totalToday: stats.today
      }}
    />
  );
};
