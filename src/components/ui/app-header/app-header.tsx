import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isRouteActive = (path: string) => {
    if (path === '/') {
      return (
        location.pathname === '/' || location.pathname.includes('/ingredients')
      );
    }
    return location.pathname.includes(path);
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={isRouteActive('/') ? 'primary' : 'secondary'} />
            <Link
              to='/'
              className={isRouteActive('/') ? styles.link_active : styles.link}
            >
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </Link>
          </>
          <>
            <ListIcon type={isRouteActive('/feed') ? 'primary' : 'secondary'} />
            <Link
              to='/feed'
              className={
                isRouteActive('/feed') ? styles.link_active : styles.link
              }
            >
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </Link>
          </>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon
            type={isRouteActive('/profile') ? 'primary' : 'secondary'}
          />
          <Link
            to='/profile'
            className={
              isRouteActive('/profile') ? styles.link_active : styles.link
            }
          >
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
