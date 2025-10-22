import {createSelector} from '@reduxjs/toolkit';
import {IProductsState} from '../../../api/types';

import {getDynamicColumns, getFlatProducts} from '../../../globalUtils';

export const selectProducts = (state: IProductsState) => state?.products?.data.result.results;
export const selectBatchId = (state: IProductsState) => state?.products.data.orderBatchId;
export const selectPage = (state: IProductsState) => state.products?.data.result.page;
export const selectSize = (state: IProductsState) => state.products?.data.result.size;
export const selectTotalElements = (state: IProductsState) => state?.products.data.result.totalElements;
export const selectTotalPages = (state: IProductsState) => state.products?.data.result.totalPages;
export const selectDynamicColumns = createSelector([selectProducts], (products) => getDynamicColumns(products));

export const selectTableData = createSelector([selectProducts], (products) => {
    return getFlatProducts(products);
});
