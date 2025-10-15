import {
    ActionReducerMapBuilder,
    AnyAction,
    createSlice,
    SliceCaseReducers,
    ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';
import {ErrorState, FulfilledAction, PendingAction, RejectedAction, StatusesTypes} from './types';

export interface IGenericState<T> {
    data: T;
    statuses: {[key: string]: StatusesTypes};
    lastRequestId: {[key: string]: string};
    errors: {[key: string]: ErrorState};
}

const isPendingAction = (action: AnyAction): action is PendingAction => {
    return action.type.endsWith('/pending');
};

export const isFulfilledAction = (action: AnyAction): action is FulfilledAction => {
    return action.type.endsWith('/fulfilled');
};

export const isRejectedAction = (action: AnyAction): action is RejectedAction => {
    return action.type.endsWith('/rejected');
};

const getThunkName = (actionType: string, sliceName: string): string | null => {
    const splitType = actionType.split('/');
    if (splitType[0] === sliceName) {
        return splitType[splitType.length - 2];
    }

    return null;
};

const createGenericSlice = <T, Reducers extends SliceCaseReducers<IGenericState<T>>>({
    name = '',
    initialState,
    reducers,
    extraReducers,
}: {
    name: string;
    initialState: IGenericState<T>;
    reducers: ValidateSliceCaseReducers<IGenericState<T>, Reducers>;
    extraReducers: (builder: ActionReducerMapBuilder<IGenericState<T>>) => void;
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            resetSlice: (state: IGenericState<T>) => {
                state.data = initialState.data;

                state.statuses = {};
                state.errors = {};
                state.lastRequestId = {};
            },
            ...reducers,
        },
        extraReducers: (builder) => {
            extraReducers(builder);

            builder.addMatcher(isPendingAction, (state, action) => {
                const thunkName = getThunkName(action.type, name);

                if (thunkName) {
                    state.statuses[thunkName] = StatusesTypes.loading;
                    state.lastRequestId[thunkName] = action.meta.requestId;
                    delete state.errors[thunkName];
                }
            });
            builder.addMatcher(isFulfilledAction, (state, action) => {
                const thunkName = getThunkName(action.type, name);
                if (thunkName) {
                    state.statuses[thunkName] = StatusesTypes.finished;
                }
            });
            builder.addMatcher(isRejectedAction, (state, action) => {
                const thunkName = getThunkName(action.type, name);
                if (thunkName) {
                    if (state.lastRequestId[thunkName] === action.meta.requestId) {
                        state.statuses[thunkName] = StatusesTypes.error;
                        state.errors[thunkName] = {
                            error: action.error,
                            payload: action.payload,
                            requestId: action.meta.requestId,
                        } as ErrorState;
                    }
                }
            });
        },
    });
};

export default createGenericSlice;
