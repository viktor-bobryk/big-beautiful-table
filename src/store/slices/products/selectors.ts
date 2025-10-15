import {IProductsState} from '../../../api/types';

export const selectProducts = (state: IProductsState) => state.orders.data.results;
export const selectPage = (state: IProductsState) => state.orders.data.page;
export const selectSize = (state: IProductsState) => state.orders.data.size;
export const selectTotalElements = (state: IProductsState) => state.orders.data.totalElements;
export const selectTotalPages = (state: IProductsState) => state.orders.data.totalPages;
