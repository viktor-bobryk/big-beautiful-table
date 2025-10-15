import {createAsyncThunk} from '@reduxjs/toolkit';
import {slicesNames} from '../constants';
import {productNames} from './constants';
import {IProductsResponseData} from '../../../api/types';
import {getProducts} from '../../../api/products';

export const fetchProducts = createAsyncThunk<
    IProductsResponseData,
    void, // <— No argument expected
    {rejectValue: {message: unknown}}
>(`${slicesNames.products}/${productNames.getProducts}`, async (_, {rejectWithValue}) => {
    try {
        return await getProducts();
    } catch (err) {
        return rejectWithValue({message: err});
    }
});
