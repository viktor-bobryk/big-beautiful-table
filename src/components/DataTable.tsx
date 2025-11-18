import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import {AllCommunityModule, CellPosition, ColDef, GridOptions, ModuleRegistry} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {PaginatorPageChangeEvent} from 'primereact/paginator';

import {selectDynamicColumns, selectTableData} from '../store/slices/products/selectors';
import {fetchProducts} from '../store/slices/products/thunks';
import {updateValue} from '../store/slices/products/productsSlice';
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

ModuleRegistry.registerModules([AllCommunityModule]);

interface CustomGridOptions extends GridOptions {
    tabToNextCell?: (params: {previousCellPosition: CellPosition}) => CellPosition | null;
}

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

    const gridOptions: CustomGridOptions = {
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
                    suppressNavigable: true,
                    ...({suppressTabbing: true} as any), // Required so Shift+Tab works
                }}
                onRowClicked={onRowClicked}
                onRowSelected={onRowSelected}
                onCellValueChanged={(params) => {
                    onCellValueChanged(params);
                }}
                getRowId={(params) => params.data.id}
                rowHeight={35}
                headerHeight={38}
                animateRows={false}
                suppressMovableColumns={false}
                gridOptions={gridOptions}
                onSelectionChanged={onSelectionChanged}
                stopEditingWhenCellsLoseFocus={true} // close editor when clicked outside
                {...{
                    tabToNextCell: (params) => {
                        const {previousCellPosition, backwards, api} = params;

                        const lastRowIndex = api.getDisplayedRowCount() - 1;
                        const firstRowIndex = 0;

                        let nextRowIndex = backwards
                            ? previousCellPosition.rowIndex - 1
                            : previousCellPosition.rowIndex + 1;

                        // Loop to top                         // Loop to bottom
                        if (nextRowIndex > lastRowIndex) nextRowIndex = firstRowIndex;
                        if (nextRowIndex < firstRowIndex) nextRowIndex = lastRowIndex;

                        return {
                            rowIndex: nextRowIndex,
                            rowPinned: previousCellPosition.rowPinned,
                            column: previousCellPosition.column,
                        };
                    },
                }}
                onCellKeyDown={(params) => {
                    const e = params.event as KeyboardEvent;

                    // Cast to the normal event (we know we are not using full-width rows)
                    const col = (params as any).column;
                    const api = params.api;
                    // const rowIndex = params.node?.rowIndex ?? 0;

                    if (!col) return; // fallback safety
                    if (e.key === 'Tab') {
                        setTimeout(() => {
                            const focused = api.getFocusedCell();
                            if (focused) {
                                api.startEditingCell({
                                    rowIndex: focused.rowIndex,
                                    colKey: focused.column.getId(),
                                });
                            }
                        }, 0);
                        return;
                    }
                    if (e.key === 'ArrowRight') {
                        e.preventDefault();

                        const displayedCols = api.getAllDisplayedColumns();

                        // Identify only dynamic columns
                        const dynamicCols = displayedCols.filter((c) => c.getColId().startsWith('forecast_'));

                        const currentCol = col;
                        const rowIndex = params.node?.rowIndex ?? 0;

                        const isDynamic = dynamicCols.includes(currentCol);

                        // Normal AG Grid behavior for non-dynamic columns
                        if (!isDynamic) {
                            const nextCol = api.getDisplayedColAfter(col);
                            if (nextCol) {
                                api.stopEditing();
                                api.setFocusedCell(rowIndex, nextCol);
                                api.startEditingCell({
                                    rowIndex,
                                    colKey: nextCol.getId(),
                                });
                            }
                            return;
                        }

                        // Looping logic for dynamic columns
                        const currentDynamicIndex = dynamicCols.indexOf(currentCol);

                        let targetCol;
                        if (currentDynamicIndex === dynamicCols.length - 1) {
                            // Loop: last dynamic col → first dynamic col
                            targetCol = dynamicCols[0];
                        } else {
                            // Move right normally
                            targetCol = dynamicCols[currentDynamicIndex + 1];
                        }

                        api.stopEditing();
                        api.setFocusedCell(rowIndex, targetCol);
                        api.startEditingCell({
                            rowIndex,
                            colKey: targetCol.getId(),
                        });

                        return;
                    }
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();

                        const displayedCols = api.getAllDisplayedColumns();

                        // All dynamic columns start with "forecast_"
                        const dynamicCols = displayedCols.filter((c) => c.getColId().startsWith('forecast_'));

                        const currentCol = col;
                        const rowIndex = params.node?.rowIndex ?? 0;

                        const isDynamic = dynamicCols.includes(currentCol);

                        // Normal behavior for non-dynamic columns
                        if (!isDynamic) {
                            const prevCol = api.getDisplayedColBefore(col);
                            if (prevCol) {
                                api.stopEditing();
                                api.setFocusedCell(rowIndex, prevCol);
                                api.startEditingCell({
                                    rowIndex,
                                    colKey: prevCol.getId(),
                                });
                            }
                            return;
                        }

                        // Dynamic-column loop
                        const currentDynamicIndex = dynamicCols.indexOf(currentCol);

                        let targetCol;
                        if (currentDynamicIndex === 0) {
                            // Loop from first → last dynamic column
                            targetCol = dynamicCols[dynamicCols.length - 1];
                        } else {
                            // Move left normally within dynamic columns
                            targetCol = dynamicCols[currentDynamicIndex - 1];
                        }

                        api.stopEditing();
                        api.setFocusedCell(rowIndex, targetCol);
                        api.startEditingCell({
                            rowIndex,
                            colKey: targetCol.getId(),
                        });

                        return;
                    }
                }}
            />
            <Footer totalRecords={tableData.length} pagination={pagination} onPageSelect={onPageChange} />
        </div>
    );
};

export default DataTable;
