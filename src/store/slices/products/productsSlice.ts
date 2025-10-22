import createGenericSlice from '../createGenericSlice';
import {fetchProducts} from './thunks';
import {slicesNames} from '../constants';

const initialState = {
    orderBatchId: '',
    result: {page: 0, size: 0, totalElements: 0, totalPages: 0, sort: '', results: []},
};

export const productsSlice = createGenericSlice({
    name: slicesNames.products,
    initialState: {
        data: initialState,
        statuses: {},
        errors: {},
        lastRequestId: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (state, {payload}) => {
            if (payload) {
                console.log('payload ', payload);
                state.data = payload;
            }
        });
    },
});

export const {resetSlice} = productsSlice.actions;
