import React, {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {AgGridReact} from 'ag-grid-react';
import {ModuleRegistry, AllCommunityModule, ColDef} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {selectDynamicColumns, selectTableData} from '../store/slices/products/selectors';
import {fetchProducts} from '../store/slices/products/thunks';
import {useAppDispatch} from '../hooks/redux';
import {defaultColumns} from '../globalConstants';

ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable: React.FC = () => {
    const [columns, setColumns] = useState([]);
    const [rowData, setRowData] = useState([]);

    const dynamicColumns = useSelector(selectDynamicColumns);
    const tableData = useSelector(selectTableData);
    const dispatch = useAppDispatch();

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            resizable: true,
            wrapText: false,
            autoHeight: false,
        };
    }, []);

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
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                headerHeight={38}
            />
        </div>
    );
};

export default DataTable;
