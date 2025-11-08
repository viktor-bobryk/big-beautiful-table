import {MultiSelect} from 'primereact/multiselect';

import styles from './VisibilityControl.module.scss';

const VisibilityControl = ({
    selectedOptions,
    allOptions,
    onColumnsToggle,
    handleShow,
    handleHide,
    isDropdownVisible,
    isExportSuccessful,
}) => {
    return (
        <div className={styles.icon}>
            <MultiSelect
                value={selectedOptions}
                options={allOptions}
                optionLabel="headerName"
                onChange={onColumnsToggle}
                onShow={handleShow}
                onHide={handleHide}
                appendTo={'self'}
                panelClassName={styles.panel}
                className="w-full column-visibility"
                dropdownIcon={isDropdownVisible ? 'pi pi-eye' : 'pi pi-eye-slash'}
                disabled={isExportSuccessful}
            />
        </div>
    );
};

export default VisibilityControl;
