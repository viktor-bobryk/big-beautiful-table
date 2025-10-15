import {isArray, compact, isEqual, keys} from 'lodash';
import {createSelectorCreator, lruMemoize} from 'reselect';

import {statusesTypes} from './constants';

export const selectLoading = (sliceName: string, thunkName: string) => (state: object) => {
    const slice = state[sliceName];
    if (!slice) return false;

    if (isArray(thunkName)) {
        return Boolean(compact(thunkName.map((name) => slice.statuses[name] === statusesTypes.loading)).length);
    }
    return slice.statuses[thunkName] === statusesTypes.loading;
};

export const selectSliceErrors = (sliceName: string) => (state: object) => {
    const slice = state[sliceName];

    if (!slice) return {};

    return slice.errors;
};

const createDeepEqualSelector = createSelectorCreator(lruMemoize, isEqual);

export const selectErrors = (sliceName: string) =>
    createDeepEqualSelector(selectSliceErrors(sliceName), (errors) => {
        return keys(errors).map((name) => ({...errors[name], thunk: name}));
    });
