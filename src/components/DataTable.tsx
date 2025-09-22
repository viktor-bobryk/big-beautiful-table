import React, {useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, ModuleRegistry, AllCommunityModule} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import classNames from 'classnames';

import styles from './DataTable.module.scss';

// Register all Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

type Person = {
    name: string;
    age: number;
    job: string;
};

const DataTable: React.FC = () => {
    const [rowData] = useState<Person[]>([
        {name: 'John Doe', age: 28, job: 'Developer'},
        {name: 'Jane Smith', age: 34, job: 'Designer'},
        {name: 'Mike Johnson', age: 45, job: 'Manager'},
    ]);

    const [columnDefs] = useState<ColDef<Person>[]>([
        {field: 'name', headerName: 'Name', sortable: true, filter: true},
        {field: 'age', headerName: 'Age', sortable: true, filter: true},
        {field: 'job', headerName: 'Job Title', sortable: true, filter: true},
    ]);

    return (
        <div className={classNames('ag-theme-alpine', styles['data-table'])}>
            <AgGridReact<Person> rowData={rowData} columnDefs={columnDefs} pagination={true} paginationPageSize={5} />
        </div>
    );
};

export default DataTable;
