import {MultiSelectChangeEvent} from 'primereact/multiselect';
import {ColDef} from 'ag-grid-community';

export interface IPagination {
    first: number;
    rows: number;
    page?: number;
    pageCount?: number;
}

export interface IColumnChild {
    field: string;
    headerName: string;
    sortable: boolean;
    width: number;
    headerClass: string;
    pinned?: string;
    lockPinned?: boolean;
}
export interface IColumn {
    field: string;
    headerName: string;
    sortable?: boolean;
    width?: number;
    headerClass: string;
    marryChildren?: boolean;
    wrapText?: boolean;
    autoHeight?: boolean;
    pinned?: string;
    suppressMovable?: boolean;
    lockPinned?: boolean;
    sort?: string;
    children?: IColumnChild[];
}

export interface IOption {
    field: string;
    headerName: string;
}

export interface MultiSelectChangeEventWithCheck extends MultiSelectChangeEvent {
    originalEvent: MultiSelectChangeEvent['originalEvent'] & {
        checked?: boolean;
    };
}
export interface SelectionColumnDefFixed extends ColDef {
    suppressTabbing?: boolean;
}
