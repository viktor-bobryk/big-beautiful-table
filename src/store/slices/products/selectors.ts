import {createSelector} from '@reduxjs/toolkit';
import {IProductsState} from '../../../api/types';

import {getDynamicColumns, getFlatProducts} from '../../../globalUtils';

export const selectProducts = (state: IProductsState) => state?.products?.data.result.results;
export const selectDynamicColumns = createSelector([selectProducts], (products) => getDynamicColumns(products));

export const selectTableData = createSelector([selectProducts], (products) => {
    return getFlatProducts(products);
});
