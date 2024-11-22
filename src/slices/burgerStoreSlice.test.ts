import { expect, describe, jest } from '@jest/globals';
import burgerStoreSlice, {
  addBurgerItem,
  removeBurgerItem,
  moveItemUp,
  fetchCatalog,
  initialState
} from './burgerStoreSlice';
import { mockIngredient } from './mockIngredient';

jest.mock('uuid', () => ({
  v4: () => 'test_id_1'
}));

describe('Редуктор хранилища бургеров', () => {
  describe('Корневой редуктор', () => {
    it('должен возвращать начальное состояние для неизвестного действия', () => {
      const state = burgerStoreSlice(undefined, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Слайс конструктора', () => {
    describe('Управление ингредиентами', () => {
      it('должен добавлять ингредиент в конструктор', () => {
        const prevState = initialState;
        const nextState = burgerStoreSlice(
          prevState,
          addBurgerItem(mockIngredient)
        );

        expect(nextState.burgerBuilder.ingredients).toHaveLength(1);
        const { id: _, ...receivedWithoutId } =
          nextState.burgerBuilder.ingredients[0];
        const { id: __, ...expectedWithoutId } = mockIngredient;
        expect(receivedWithoutId).toEqual(expectedWithoutId);
      });

      it('должен удалять ингредиент из конструктора', () => {
        const stateWithIngredient = burgerStoreSlice(
          initialState,
          addBurgerItem(mockIngredient)
        );

        const nextState = burgerStoreSlice(
          stateWithIngredient,
          removeBurgerItem({ ...mockIngredient, id: 'test_id_1' })
        );

        expect(nextState.burgerBuilder.ingredients).toHaveLength(0);
      });

      it('должен изменять порядок ингредиентов', () => {
        const testIngredient1 = {
          ...mockIngredient,
          id: 'test_id_1'
        };
        const testIngredient2 = {
          ...mockIngredient,
          id: 'test_id_2'
        };

        let state = initialState;
        state = burgerStoreSlice(state, addBurgerItem(testIngredient1));
        state = burgerStoreSlice(state, addBurgerItem(testIngredient2));

        const nextState = burgerStoreSlice(state, moveItemUp(testIngredient1));

        expect(nextState.burgerBuilder.ingredients[0].id).toEqual(
          testIngredient1.id
        );
        expect(nextState.burgerBuilder.ingredients[0].name).toEqual(
          testIngredient1.name
        );
      });
    });
  });

  describe('Асинхронные действия - Загрузка ингредиентов', () => {
    it('должен устанавливать загрузку в true при ожидании', () => {
      const state = burgerStoreSlice(
        initialState,
        fetchCatalog.pending('', undefined)
      );
      expect(state.isLoading).toBe(true);
    });

    it('должен обновлять каталог и устанавливать загрузку в false при выполнении', () => {
      const mockCatalog = [mockIngredient];
      const state = burgerStoreSlice(
        initialState,
        fetchCatalog.fulfilled(mockCatalog, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.catalog).toEqual(mockCatalog);
    });

    it('должен обрабатывать ошибку загрузки и устанавливать загрузку в false', () => {
      const errorMessage = 'Ошибка загрузки';
      const error = new Error(errorMessage);

      const state = burgerStoreSlice(
        initialState,
        fetchCatalog.rejected(error, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(error.message);
    });
  });
});
