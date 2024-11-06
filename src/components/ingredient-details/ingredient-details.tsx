import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';
import { selectCatalog } from '../../slices/burgerStoreSlice';
import { useAppSelector } from '../../services/store';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectCatalog);

  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true });
    }
  }, [id, navigate]);

  const ingredientData = ingredients.find(
    (item: TIngredient) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
