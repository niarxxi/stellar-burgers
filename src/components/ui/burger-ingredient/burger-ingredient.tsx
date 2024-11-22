import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';
import { showDetails } from '../../../slices/burgerStoreSlice';
import { useAppDispatch } from '../../../services/store';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState, index }) => {
    const { image, price, name, _id } = ingredient;
    const dispatch = useAppDispatch();

    const showModal = () => {
      dispatch(showDetails());
    };

    return (
      <li
        className={styles.container}
        data-cy={
          ingredient.type === 'bun' ? `bun-${index}` : `ingredient-${index}`
        }
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
          onClick={showModal}
        >
          {count && <Counter count={count} />}
          <img className={styles.img} src={image} alt='картинка ингредиента.' />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <AddButton
          text='Добавить'
          onClick={handleAdd}
          extraClass={`${styles.addButton} mt-8`}
        />
      </li>
    );
  }
);
