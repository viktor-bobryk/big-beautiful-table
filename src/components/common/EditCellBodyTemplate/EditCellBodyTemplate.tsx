import React from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import styles from './EditCellBodyTemplate.module.scss';

const EditCellBodyTemplate: React.FC<ICellRendererParams> = (params) => {
    return (
        <div className={styles['edit-cell-body-template']}>
            <span>{params.value}</span>
            <i className="pi pi-pencil"></i>
        </div>
    );
};

export default EditCellBodyTemplate;
