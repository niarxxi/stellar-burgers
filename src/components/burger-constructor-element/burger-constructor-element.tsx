import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeBurgerItem,
  moveItemDown,
  moveItemUp
} from '../../slices/burgerStoreSlice';
import { useAppDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      dispatch(moveItemDown(ingredient));
    };

    const handleMoveUp = () => {
      dispatch(moveItemUp(ingredient));
    };

    const handleClose = () => {
      dispatch(removeBurgerItem(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
