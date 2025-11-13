import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, ColDef, GridOptions, ModuleRegistry} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {PaginatorPageChangeEvent} from 'primereact/paginator';

import {selectDynamicColumns, selectTableData} from '../store/slices/products/selectors';
import {fetchProducts} from '../store/slices/products/thunks';
import {useAppDispatch} from '../hooks/redux';
import {useRowSelection} from '../hooks/useRowSelection';
import {defaultColumns, localSavedValue} from '../globalConstants';

import VisibilityControl from './common/VisibilityControl/VisibilityControl';
import {
    getAllOptions,
    getColumnsFromOptions,
    getColumnsFromSavedString,
    getDays,
    getNormal,
    getOptionsFromColumns,
    getOrderedDays,
    getVisibleNames,
} from '../globalUtils';
import {MultiSelectChangeEventWithCheck} from '../globalTypes';

import Footer from './common/Footer/Footer';
import {updateValue} from '../store/slices/products/productsSlice';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable: React.FC = () => {
    const [columns, setColumns] = useState([]);
    const [pagination, setPagination] = useState({first: 0, rows: 10, page: 1, pageCount: 11});
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    console.log('selectedRows', selectedRows);

    const gridRef = useRef<AgGridReact>(null);

    const dynamicColumns = useSelector(selectDynamicColumns);
    const tableData = useSelector(selectTableData);

    const dispatch = useAppDispatch();

    const {onRowClicked, onRowSelected} = useRowSelection({
        setSelectedRows,
    });

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

    const onColsVisibilityToggle = (event: MultiSelectChangeEventWithCheck) => {
        const normalOptions = getNormal(event.value);

        const dayOptions = getDays(event.value);
        const orderedOptions = getOrderedDays(dayOptions);

        const options = [...normalOptions, ...orderedOptions];
        const visibleNames = getVisibleNames(options);

        localStorage.setItem(localSavedValue.VISIBLE_COLUMNS, visibleNames);
        const newColumns = getColumnsFromOptions(options, [...defaultColumns, ...dynamicColumns]);
        setColumns(newColumns);
        setSelectedOptions(getOptionsFromColumns(newColumns, event.originalEvent.checked));
    };

    const onCellValueChanged = (value) => {
        dispatch(updateValue(value));
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const savedColNames = localStorage.getItem(localSavedValue.VISIBLE_COLUMNS);
        if (dynamicColumns.length) {
            const allColumns = [...defaultColumns, ...dynamicColumns];
            if (savedColNames) {
                const savedColumns = getColumnsFromSavedString(savedColNames, allColumns);
                setColumns(savedColumns);
                setSelectedOptions(getOptionsFromColumns(savedColumns, undefined));
            } else {
                setColumns(allColumns);
                setSelectedOptions(getOptionsFromColumns(allColumns, undefined));
            }
        }
    }, [dynamicColumns]);

    return (
        <div className="custom-grid-container ag-theme-alpine">
            <div className="table-header">
                <VisibilityControl
                    selectedOptions={selectedOptions}
                    allOptions={getAllOptions()}
                    onColumnsToggle={onColsVisibilityToggle}
                    handleShow={undefined}
                    handleHide={undefined}
                    isDropdownVisible={undefined}
                    isExportSuccessful={undefined}
                />
            </div>
            <AgGridReact
                // theme="legacy"
                ref={gridRef}
                rowData={tableData}
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
                stopEditingWhenCellsLoseFocus={true} // close editor when clicked outside
                onCellValueChanged={(params) => {
                    onCellValueChanged(params);
                }}
            />
            <Footer totalRecords={tableData.length} pagination={pagination} onPageSelect={onPageChange} />
        </div>
    );
};

export default DataTable;
