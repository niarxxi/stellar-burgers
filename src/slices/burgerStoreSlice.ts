import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TBurgerBuilder,
  TIngredient,
  TIngredientWithId,
  TOrder,
  TUser
} from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';
import { generateId } from '../utils/idGenerator';

export type TBurgerStoreState = {
  catalog: TIngredient[];
  isLoading: boolean;
  activeOrder: TOrder | null;
  burgerBuilder: TBurgerBuilder;
  isOrderProcessing: boolean;
  userData: TUser;
  orderHistory: TOrder[];
  orderStats: {
    total: number;
    today: number;
  };
  personalOrders: TOrder[] | null;
  isAuth: boolean;
  isAppInitialized: boolean;
  isDetailsVisible: boolean;
  errorMessage: string;
  currentOrder: TOrder | null;
};

export const initialState: TBurgerStoreState = {
  catalog: [],
  isLoading: false,
  activeOrder: null,
  burgerBuilder: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  isOrderProcessing: false,
  userData: {
    name: '',
    email: ''
  },
  orderHistory: [],
  orderStats: {
    total: 0,
    today: 0
  },
  personalOrders: null,
  isAuth: false,
  isAppInitialized: false,
  isDetailsVisible: false,
  errorMessage: '',
  currentOrder: null
};

export const fetchCatalog = createAsyncThunk('fetchCatalog', getIngredientsApi);
export const createOrder = createAsyncThunk('createOrder', orderBurgerApi);
export const loginUser = createAsyncThunk('login', loginUserApi);
export const registerUser = createAsyncThunk('register', registerUserApi);
export const fetchUserProfile = createAsyncThunk('fetchProfile', getUserApi);
export const fetchOrdersFeed = createAsyncThunk('fetchOrdersFeed', getFeedsApi);
export const fetchPersonalOrders = createAsyncThunk(
  'fetchPersonalOrders',
  getOrdersApi
);
export const logoutUser = createAsyncThunk('logout', logoutApi);
export const updateUserProfile = createAsyncThunk(
  'updateProfile',
  updateUserApi
);
export const getOrder = createAsyncThunk('getOrder', getOrderByNumberApi);

const burgerStoreSlice = createSlice({
  name: 'burgerStore',
  initialState,
  reducers: {
    addBurgerItem(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.burgerBuilder.bun = action.payload;
      } else {
        state.burgerBuilder.ingredients.push({
          ...action.payload,
          id: generateId()
        });
      }
    },
    clearOrder(state) {
      state.isOrderProcessing = false;
      state.activeOrder = null;
      state.burgerBuilder = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    },
    clearOrderHistory(state) {
      state.orderHistory.length = 0;
    },
    clearPersonalOrders(state) {
      state.personalOrders = null;
    },
    initializeApp(state) {
      state.isAppInitialized = true;
    },
    showDetails(state) {
      state.isDetailsVisible = true;
    },
    hideDetails(state) {
      state.isDetailsVisible = false;
    },
    removeBurgerItem(state, action: PayloadAction<TIngredientWithId>) {
      const itemIndex = state.burgerBuilder.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      state.burgerBuilder.ingredients = state.burgerBuilder.ingredients.filter(
        (_, index) => index !== itemIndex
      );
    },
    setError(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    clearError(state) {
      state.errorMessage = '';
    },
    moveItemUp(state, action: PayloadAction<TIngredientWithId>) {
      const itemIndex = state.burgerBuilder.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex > 0) {
        const newIngredients = [...state.burgerBuilder.ingredients];
        [newIngredients[itemIndex - 1], newIngredients[itemIndex]] = [
          newIngredients[itemIndex],
          newIngredients[itemIndex - 1]
        ];
        state.burgerBuilder.ingredients = newIngredients;
      }
    },
    moveItemDown(state, action: PayloadAction<TIngredientWithId>) {
      const itemIndex = state.burgerBuilder.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex < state.burgerBuilder.ingredients.length - 1) {
        const newIngredients = [...state.burgerBuilder.ingredients];
        [newIngredients[itemIndex], newIngredients[itemIndex + 1]] = [
          newIngredients[itemIndex + 1],
          newIngredients[itemIndex]
        ];
        state.burgerBuilder.ingredients = newIngredients;
      }
    }
  },
  selectors: {
    selectCatalog: (state) => state.catalog,
    selectIsLoading: (state) => state.isLoading,
    selectActiveOrder: (state) => state.activeOrder,
    selectBurgerBuilder: (state) => state.burgerBuilder,
    selectIsOrderProcessing: (state) => state.isOrderProcessing,
    selectUserData: (state) => state.userData,
    selectOrderHistory: (state) => state.orderHistory,
    selectOrderStats: (state) => state.orderStats,
    selectPersonalOrders: (state) => state.personalOrders,
    selectIsAuth: (state) => state.isAuth,
    selectIsAppInitialized: (state) => state.isAppInitialized,
    selectIsDetailsVisible: (state) => state.isDetailsVisible,
    selectErrorMessage: (state) => state.errorMessage,
    selectCurrentOrder: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.catalog = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || 'Произошла ошибка';
      })
      .addCase(createOrder.pending, (state) => {
        state.isOrderProcessing = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isOrderProcessing = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.activeOrder = action.payload.order;
        state.isOrderProcessing = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message!;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.isAuth = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message!;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.isAuth = true;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.userData = { name: '', email: '' };
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData.name = action.payload.user.name;
        state.userData.email = action.payload.user.email;
        state.isAuth = true;
      })
      .addCase(fetchOrdersFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersFeed.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchOrdersFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderHistory = action.payload.orders;
        state.orderStats.total = action.payload.total;
        state.orderStats.today = action.payload.totalToday;
      })
      .addCase(fetchPersonalOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPersonalOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchPersonalOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.personalOrders = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
          state.userData = { name: '', email: '' };
          state.isAuth = false;
        }
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.userData.name = action.payload.user.name;
          state.userData.email = action.payload.user.email;
        }
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isLoading = false;
        state.currentOrder = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const {
  selectIsLoading,
  selectCatalog,
  selectActiveOrder,
  selectBurgerBuilder,
  selectIsOrderProcessing,
  selectUserData,
  selectOrderHistory,
  selectOrderStats,
  selectPersonalOrders,
  selectIsAuth,
  selectIsAppInitialized,
  selectIsDetailsVisible,
  selectErrorMessage,
  selectCurrentOrder
} = burgerStoreSlice.selectors;

export const {
  addBurgerItem,
  clearOrder,
  clearOrderHistory,
  clearPersonalOrders,
  initializeApp,
  showDetails,
  hideDetails,
  removeBurgerItem,
  setError,
  clearError,
  moveItemUp,
  moveItemDown
} = burgerStoreSlice.actions;

export default burgerStoreSlice.reducer;
