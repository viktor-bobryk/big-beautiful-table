import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import {
    ModuleRegistry,
    AllCommunityModule,
    ColDef,
    GridOptions,
    RowSelectedEvent,
    RowClickedEvent,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {PaginatorPageChangeEvent} from 'primereact/paginator';

import {selectDynamicColumns, selectTableData} from '../store/slices/products/selectors';
import {fetchProducts} from '../store/slices/products/thunks';
import {useAppDispatch} from '../hooks/redux';
import {defaultColumns} from '../globalConstants';

import Footer from './common/Footer/Footer';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable: React.FC = () => {
    const [columns, setColumns] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [pagination, setPagination] = useState({first: 0, rows: 10, page: 1, pageCount: 11});
    const [selectedRows, setSelectedRows] = useState([]);
    const lastClickedIndex = useRef<number | null>(null);

    console.log('selectedRows', selectedRows);

    const gridRef = useRef<AgGridReact>(null);
    const lastSelectedIndex = useRef<number | null>(null);

    const dynamicColumns = useSelector(selectDynamicColumns);
    const tableData = useSelector(selectTableData);
    const dispatch = useAppDispatch();

    const onPageChange = (e: PaginatorPageChangeEvent) => {
        setPagination(e);
    };

    const gridOptions: GridOptions = {
        icons: {
            sortAscending: '<i class="pi pi-sort-amount-up-alt"></i>',
            sortDescending: '<i class="pi pi-sort-amount-down-alt"></i>',
            sortUnSort: '<i class="pi pi-sort-alt"></i>',
        },
    };

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            resizable: true,
            sortable: true,
            wrapText: false,
            autoHeight: false,
            sortingOrder: ['asc', 'desc', null],
            unSortIcon: true,
        };
    }, []);

    const onSelectionChanged = () => {
        const selected = gridRef.current!.api.getSelectedRows();
        setSelectedRows(selected);
    };

    const onRowSelected = (params: RowSelectedEvent) => {
        const api = params.api;
        const currentIndex = params.node.rowIndex!;

        const mouseEvent = params.event as MouseEvent | undefined;

        if (mouseEvent?.shiftKey && lastSelectedIndex.current !== null) {
            const start = Math.min(lastSelectedIndex.current, currentIndex);
            const end = Math.max(lastSelectedIndex.current, currentIndex);

            api.forEachNode((node) => {
                if (node.rowIndex! >= start && node.rowIndex! <= end) {
                    node.setSelected(true);
                }
            });
        }

        lastSelectedIndex.current = currentIndex;
    };

    const onRowClicked = (params: RowClickedEvent) => {
        const event = params.event as MouseEvent;
        const currentIndex = params.node.rowIndex!;
        const api = params.api;

        // --- SHIFT + CLICK: select range of rows ---
        if (event.shiftKey && lastClickedIndex.current !== null) {
            const start = Math.min(lastClickedIndex.current, currentIndex);
            const end = Math.max(lastClickedIndex.current, currentIndex);

            api.forEachNode((node) => {
                if (node.rowIndex! >= start && node.rowIndex! <= end) {
                    node.setSelected(true);
                }
            });
        }

        // --- CTRL / CMD + CLICK: select row ---
        else if (event.ctrlKey || event.metaKey) {
            params.node.setSelected(!params.node.isSelected());
        }

        lastClickedIndex.current = currentIndex;
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setColumns([...defaultColumns, ...dynamicColumns]);
    }, [dynamicColumns]);

    useEffect(() => {
        setRowData(tableData);
    }, [tableData]);

    return (
        <div className="custom-grid-container ag-theme-alpine">
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                rowSelection={{
                    mode: 'multiRow',
                    enableClickSelection: false,
                    headerCheckbox: true,
                }}
                selectionColumnDef={{
                    pinned: 'left',
                    lockPosition: true,
                    width: 45,
                    cellClass: 'checkbox-center',
                    headerClass: 'checkbox-header',
                }}
                onRowClicked={onRowClicked}
                onRowSelected={onRowSelected}
                getRowId={(params) => params.data.id}
                rowHeight={35}
                headerHeight={38}
                animateRows={false}
                suppressMovableColumns={false}
                gridOptions={gridOptions}
                onSelectionChanged={onSelectionChanged}
            />
            <Footer totalRecords={rowData.length} pagination={pagination} onPageSelect={onPageChange} />
        </div>
    );
};

export default DataTable;
