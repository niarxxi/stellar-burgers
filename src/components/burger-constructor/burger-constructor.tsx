import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  selectIsOrderProcessing,
  selectBurgerBuilder,
  selectActiveOrder,
  createOrder,
  clearOrder,
  selectIsAuth
} from '../../slices/burgerStoreSlice';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { TIngredient, TIngredientWithId } from '@utils-types';

const useBurgerConstructorData = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const orderRequest = useAppSelector(selectIsOrderProcessing);
  const constructorItems = useAppSelector(selectBurgerBuilder);
  const orderModalData = useAppSelector(selectActiveOrder);

  return { isAuth, orderRequest, constructorItems, orderModalData };
};

const calculateTotalPrice = (
  bun: Partial<TIngredient>,
  ingredients: TIngredientWithId[]
) => {
  const bunPrice = bun.price ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, item) => sum + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuth, orderRequest, constructorItems, orderModalData } =
    useBurgerConstructorData();

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { replace: true });
      return;
    }

    if (
      !constructorItems.bun._id ||
      constructorItems.ingredients.length === 0
    ) {
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      calculateTotalPrice(constructorItems.bun, constructorItems.ingredients),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
