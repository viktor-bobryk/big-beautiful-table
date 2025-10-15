import {AsyncThunk} from '@reduxjs/toolkit';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, unknown>;

export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

export enum StatusesTypes {
    loading = 'loading',
    finished = 'finished',
    error = 'error',
}

export interface ErrorState {
    error: {
        code: string;
        message: string;
    };
    payload?: {
        status: number;
        statusText: string;
        data: Record<string, unknown>;
    };
    requestId: string;
}

export enum ISlicesNames {
    snackbar = 'snackbar',
}

export type SliceNames = ISlicesNames;

export interface IDataSet {
    data: number[];
    borderColor: string;
    backgroundColor: string;
}
