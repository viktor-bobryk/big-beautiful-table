import {useEffect, useRef} from 'react';
import type {CustomCellEditorProps} from 'ag-grid-react';
import {InputText} from 'primereact/inputtext';

import {getValidCellValue} from '../../../globalUtils';

const CellEditor = ({value, onValueChange}: CustomCellEditorProps) => {
    const refInput = useRef<HTMLInputElement>(null);

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
            className="cell-editor"
            onChange={(event) => onValueChange(getValidCellValue(event.target.value))}
        />
    );
};
export default CellEditor;
