import React, {useEffect, useRef} from 'react';
import {ICellEditorParams} from 'ag-grid-community';
import {InputText} from 'primereact/inputtext';
import styles from './CellEditor.module.scss';
import {getValidCellValue} from '../../../globalUtils';
import type {CustomCellEditorProps} from 'ag-grid-react';

const CellEditor: React.FC<ICellEditorParams> = ({value, onValueChange}: CustomCellEditorProps) => {
    const refInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (refInput.current) {
            refInput.current.focus();
            refInput.current.select();
        }
    }, []);

    return (
        <InputText
            value={value}
            ref={refInput}
            type="number"
            keyfilter="int"
            className={styles['cell-editor']}
            onChange={(event) => onValueChange(getValidCellValue(event.target.value))}
        />
    );
};

export default CellEditor;
