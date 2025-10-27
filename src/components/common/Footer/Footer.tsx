import {FC} from 'react';
import {Paginator} from 'primereact/paginator';

import {IPagination} from '../../../globalTypes';

interface IProps {
    totalRecords: number | null;
    pagination: IPagination;
    onPageSelect: (pagination: {first: number; page: number; pageCount: number; rows: number}) => void;
}

const Footer: FC<IProps> = ({totalRecords, pagination, onPageSelect}) => {
    if (!totalRecords) {
        return (
            <div className="generic-list-message">
                <h3 className="text-center vertical-align-middle">Nothing found</h3>
            </div>
        );
    } else {
        return (
            <Paginator
                rows={pagination.rows}
                totalRecords={totalRecords}
                first={pagination.first}
                rowsPerPageOptions={[10, 20, 50]}
                template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink
                LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                onPageChange={onPageSelect}
            />
        );
    }
};

export default Footer;
