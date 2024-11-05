import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUserData } from '../../slices/burgerStoreSlice';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useAppSelector(selectUserData);
  return <AppHeaderUI userName={user.name} />;
};
