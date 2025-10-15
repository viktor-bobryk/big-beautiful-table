import {mockedData} from '../globalConstants';
import {IProductsResponseData} from './types';

export const getProducts = async (): Promise<IProductsResponseData> => {
    return mockedData;
};
