import {useEffect, useState} from 'react';
import {Checkbox} from 'primereact/checkbox';

const PrimeCheckboxRenderer = (props: any) => {
    const [checked, setChecked] = useState<boolean>(props.node.isSelected());

    useEffect(() => {
        const onRowSelected = () => setChecked(props.node.isSelected());
        props.node.addEventListener('rowSelected', onRowSelected);
        return () => props.node.removeEventListener('rowSelected', onRowSelected);
    }, [props.node]);

    return (
        <Checkbox
            checked={checked}
            onChange={(e) => props.node.setSelected(!!e.checked)}
            className="p-checkbox-sm"
            onClick={(ev) => ev.stopPropagation()} // avoid row click side-effects
        />
    );
};

export default PrimeCheckboxRenderer;
