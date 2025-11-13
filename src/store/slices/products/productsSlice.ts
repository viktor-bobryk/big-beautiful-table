import createGenericSlice, {IGenericState} from '../createGenericSlice';
import {fetchProducts} from './thunks';
import {slicesNames} from '../constants';
import {PayloadAction} from '@reduxjs/toolkit';
import {getUpdatedValue} from '../../../globalUtils';

const initialState = {
    orderBatchId: '',
    result: {page: 0, size: 0, totalElements: 0, totalPages: 0, sort: '', results: []},
};

const reducers = {
    updateValue: (state: IGenericState<any>, action: PayloadAction<number>) => {
        state.data.result.results = getUpdatedValue(state.data.result.results, action.payload);
    },
};

export const productsSlice = createGenericSlice({
    name: slicesNames.products,
    initialState: {
        data: initialState,
        statuses: {},
        errors: {},
        lastRequestId: {},
    },
    reducers: reducers,
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, {payload}) => {
            if (payload) {
                state.data = payload;
            }
        });
    },
});

export const {resetSlice, updateValue} = productsSlice.actions;
