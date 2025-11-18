import React, {useEffect, useRef, useState} from 'react';
import {ICellEditorParams} from 'ag-grid-community';
import {InputText} from 'primereact/inputtext';
import styles from './CellEditor.module.scss';
import {getValidCellValue} from '../../../globalUtils';

const CellEditor: React.FC<ICellEditorParams> = (props) => {
    const {value} = props;
    const [currentValue, setCurrentValue] = useState<string>(value ?? '');
    const refInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const el = refInput.current;
        el?.focus(); // only focus, no setSelectionRange for type="number"
    }, []);

    return (
        <InputText
            value={currentValue}
            ref={refInput}
            type="number"
            keyfilter="int"
            className={styles['cell-editor']}
            onChange={(event) => setCurrentValue(getValidCellValue(event.target.value))}
        />
    );
};

export default CellEditor;
