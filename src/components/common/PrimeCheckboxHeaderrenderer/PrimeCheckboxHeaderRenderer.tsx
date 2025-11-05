import {useCallback, useEffect, useRef, useState} from 'react';
import {Checkbox} from 'primereact/checkbox';

const PrimeCheckboxHeaderRenderer = (props: any) => {
    const [checked, setChecked] = useState(false);

    // <-- use HTMLInputElement ref, NOT Checkbox ref
    const inputRef = useRef<HTMLInputElement | null>(null);

    const updateHeaderState = useCallback(() => {
        let total = 0;
        let selected = 0;

        props.api.forEachNodeAfterFilterAndSort((node: any) => {
            if (node.selectable === false) return;
            total += 1;
            if (node.isSelected()) selected += 1;
        });

        setChecked(selected === total);

        if (inputRef.current) {
            inputRef.current.indeterminate = selected > 0 && selected < total;
        }
    }, [props.api]);

    const toggleAll = useCallback(() => {
        const newValue = !checked;

        if (newValue) {
            props.api.selectAllFiltered(); // ✅ works in v34+
        } else {
            props.api.deselectAll();
        }

        setChecked(newValue);
    }, [checked, props.api]);

    useEffect(() => {
        props.api.addEventListener('selectionChanged', updateHeaderState);
        props.api.addEventListener('modelUpdated', updateHeaderState);

        updateHeaderState();

        return () => {
            props.api.removeEventListener('selectionChanged', updateHeaderState);
            props.api.removeEventListener('modelUpdated', updateHeaderState);
        };
    }, [props.api, updateHeaderState]);

    return (
        <Checkbox
            checked={checked}
            onChange={toggleAll}
            className="p-checkbox-sm"
            inputRef={inputRef} // ✅ PrimeReact exposes this ref for the input
        />
    );
};

export default PrimeCheckboxHeaderRenderer;
