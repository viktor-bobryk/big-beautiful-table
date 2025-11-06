import {useRef, useCallback} from 'react';
import {RowClickedEvent, RowSelectedEvent} from 'ag-grid-community';

interface UseAgGridRowSelectionProps<T> {
    setSelectedRows: (rows: T[]) => void;
}

export const useRowSelection = <T>({setSelectedRows}: UseAgGridRowSelectionProps<T>) => {
    const lastClickedIndex = useRef<number | null>(null);

    /** Row click handler (Ctrl + click, Shift + click range selection) */
    const onRowClicked = useCallback((params: RowClickedEvent) => {
        const mouseEvent = params.event as MouseEvent;
        const api = params.api;
        const currentIndex = params.node.rowIndex!;

        // SHIFT + click → select a range of rows
        if (mouseEvent.shiftKey && lastClickedIndex.current !== null) {
            const start = Math.min(lastClickedIndex.current, currentIndex);
            const end = Math.max(lastClickedIndex.current, currentIndex);

            api.forEachNode((node) => {
                if (node.rowIndex! >= start && node.rowIndex! <= end) {
                    node.setSelected(true);
                }
            });

            return;
        }

        // CTRL/CMD + click → select row
        if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
            params.node.setSelected(!params.node.isSelected());
            lastClickedIndex.current = currentIndex;
            return;
        }

        // Normal click (ignored, only checkbox / ctrl / shift will select)
        lastClickedIndex.current = currentIndex;
    }, []);

    /** Fires after selection changes (checkbox / ctrl / shift) */
    const onRowSelected = useCallback(
        (params: RowSelectedEvent<T>) => {
            const selectedRows = params.api.getSelectedRows();
            setSelectedRows(selectedRows);
        },
        [setSelectedRows],
    );

    return {onRowClicked, onRowSelected};
};
