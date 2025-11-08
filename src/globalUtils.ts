import {IProduct} from './api/types';
import moment from 'moment';
import {dateFormat, dayColOptions, defaultColumns, defaultDayOptions, defaultRowFields} from './globalConstants';
import {IColumn, IOption} from './globalTypes';

export const getFlatProducts = (products: IProduct[]) => {
    return products.map((product: IProduct) => {
        const orderQuantity = product.orderQuantity.map((day) => {
            const date = moment(day?.shipmentDate, dateFormat.USA);
            return {
                id: day.id,
                shipmentDate: date.format(dateFormat.USA),
                shipmentDay: date.format('dddd'),
                qty: day.qty,
                shelves: day.shelves,
                carts: day.carts,
                exportedOrderQty: day.exportedOrderQty,
                forecast: day.forecast,
            };
        });
        const newColumnsArray = orderQuantity.map((day) => {
            return {
                [`forecast_${day.shipmentDay.toLowerCase()}_${day?.shipmentDate}_qty`]: day.qty,
                [`forecast_${day.shipmentDay.toLowerCase()}_${day?.shipmentDate}_carts`]: day.carts,
                [`forecast_${day.shipmentDay.toLowerCase()}_${day?.shipmentDate}_shelves`]: day.shelves,
                [`forecast_${day.shipmentDay.toLowerCase()}_${day?.shipmentDate}_date`]: day?.shipmentDate,
            };
        });
        const dynamicValues = newColumnsArray.reduce((acc, obj) => ({...acc, ...obj}), {});
        const defaultValues = {
            [defaultRowFields.ID]: product.id,
            [defaultRowFields.STORE]: product.store.name,
            [defaultRowFields.CITY]: product.store.address.city,
            [defaultRowFields.STATE]: product.store.address.state,
            [defaultRowFields.SHIP_ZONE_DESCRIPTION]: product.store.shipZone?.description,
            [defaultRowFields.SHIP_ZONE_CODE]: product.store.shipZone?.code,
            [defaultRowFields.SHIP_ZONE_ID]: product.store.shipZone?.id,
            [defaultRowFields.STORE_GROUP_ID]: product.store.group.id,
            [defaultRowFields.STORE_GROUP_NAME]: product.store.group.name,
            [defaultRowFields.PRODUCT_PROGRAM_NAME]: product.product.program.name,
            [defaultRowFields.PRODUCT_PROGRAM_ID]: product.product.program.id,
            [defaultRowFields.PRODUCT_CATEGORY_NAME]: product.product.category.name,
            [defaultRowFields.PRODUCT_CATEGORY_ID]: product.product.category.id,
            [defaultRowFields.PRODUCT_CATEGORY_DESCRIPTION]: product.product.category.description,
            [defaultRowFields.PRODUCT_CODE]: product.product.code.code,
            [defaultRowFields.PRODUCT_ID]: product.product.code.id,
            [defaultRowFields.ITEM_DESCRIPTION]: product.product.itemDescription,
            [defaultRowFields.STORE_INVENTORY_ON_HAND]: product.product.inventory.onHand,
            [defaultRowFields.STORE_INVENTORY_DAYS]: product.product.inventory.days,
            [defaultRowFields.DEMAND_QTY]: product.predictedDemand ? product.predictedDemand.qty : 0,
            [defaultRowFields.DEMAND_SHELVES]: product.predictedDemand ? product.predictedDemand.shelves : 0,
            [defaultRowFields.ON_ORDER]: product.onOrder.qty,
            [defaultRowFields.AVAILABILITY_ID]: product.availability.id,
            [defaultRowFields.AVAILABILITY_QTY]: product.availability.qty,
            [defaultRowFields.AVAILABILITY_UPDATED_QTY]: product.availability.updatedQty,
            [defaultRowFields.AVAILABILITY_UPDATED_SHELVES]: product.availability.updatedShelves,
            [defaultRowFields.PREDICTED_DEMAND]: product.predictedDemand,
        };
        return {...defaultValues, ...dynamicValues};
    });
};

export const getDynamicColumns = (products: IProduct[]) => {
    return products && products.length
        ? products[0].orderQuantity.map((day) => {
              return {
                  field: `forecast_${moment(day.shipmentDate, 'MM/DD/YYYY').format('dddd').toLowerCase()}_${day?.shipmentDate}`,
                  headerName: `${moment(day.shipmentDate, 'MM/DD/YYYY').format('dddd')} ${day.shipmentDate}`,
                  headerClass: 'outer-header',
                  marryChildren: true,
                  suppressMovable: true,
                  children: [
                      {
                          field: `forecast_${moment(day.shipmentDate, 'MM/DD/YYYY').format('dddd').toLowerCase()}_${day?.shipmentDate}_qty`,
                          headerName: 'Qty',
                          sortable: true,
                          width: 76,
                          headerClass: 'nested-header',
                          resizable: true,
                          suppressMovable: true,
                          sort: 'asc',
                      },
                      {
                          field: `forecast_${moment(day.shipmentDate, 'MM/DD/YYYY').format('dddd').toLowerCase()}_${day?.shipmentDate}_shelves`,
                          headerName: 'Shelves',
                          sortable: true,
                          width: 76,
                          headerClass: 'nested-header',
                          resizable: true,
                          suppressMovable: true,
                          sort: 'asc',
                      },
                      {
                          field: `forecast_${moment(day.shipmentDate, 'MM/DD/YYYY').format('dddd').toLowerCase()}_${day?.shipmentDate}_carts`,
                          headerName: 'Carts',
                          sortable: true,
                          width: 76,
                          headerClass: 'nested-header',
                          resizable: true,
                          suppressMovable: true,
                          sort: 'asc',
                      },
                  ],
              };
          })
        : [];
};

// Days/forecast columns/ column options
export const getNormal = (cols: IColumn[] | IOption[]) => {
    return cols.filter((el) => !el.field.startsWith(defaultRowFields.FORECAST));
};

// Days/forecast columns/ column options
export const getDays = (cols: IColumn[] | {field: string; headerName: string}[]) => {
    return cols.filter((el) => el.field.startsWith(defaultRowFields.FORECAST));
};

//Transform day column field name into day option field ('forecast_sunday_10/19/2025' => 'forecast_sunday')
export const getOptionDayField = (colField: string) => {
    return colField.substring(0, colField.indexOf('_', colField.indexOf('_') + 1));
};

//Transform day column header name into day option name ('Sunday 10/19/2025' => 'Sunday')
export const getOptionDayName = (colName: string) => colName.split(' ')[0];

// Permanent columns that always presented in table
export const getPermanentCols = (cols: IColumn[]) => {
    return cols.filter((el) => el.field === defaultRowFields.STORE);
};

export const getVisibleNames = (visibleColumns: IOption[]) => {
    return visibleColumns.map((column) => column.field).join(',');
};

export const getOrderedDays = (options: IOption[]) => {
    return dayColOptions.filter((day) => options.some((selected) => selected.field === day.field));
};

export const getAllOptions = () => {
    const normalColumns = defaultColumns
        .map((col) => {
            return {field: col.field, headerName: col.headerName};
        })
        .filter((col) => col.field !== defaultRowFields.STORE);
    return [...normalColumns, ...dayColOptions];
};

export const getColumnsFromSavedString = (savedStr: string, allCols: IColumn[]) => {
    const orderedFields = savedStr.split(',');
    const savedCols = orderedFields.reduce((acc, selectedField) => {
        const found = allCols.find((col) => col.field.startsWith(selectedField));

        if (found) acc.push(found);
        return acc;
    }, []);
    return [defaultColumns[0], ...savedCols];
};

export const getColumnsFromOptions = (options: IOption[], allCols: IColumn[]) => {
    const orderedFields = options.map((o) => o.field);

    const savedCols = orderedFields.reduce((acc, selectedField) => {
        const found = allCols.find((col) => col.field.startsWith(selectedField));

        if (found) acc.push(found);
        return acc;
    }, []);

    return [defaultColumns[0], ...savedCols];
};

export const getOptionsFromColumns = (columns: IColumn[], checked: boolean | undefined) => {
    if (columns.length) {
        const normalCols = getNormal(columns);
        const dayCols = getDays(columns);

        const normalColOptions = normalCols
            .map((col) => {
                return {field: col.field, headerName: col.headerName};
            })
            .filter((col) => col.field !== defaultRowFields.STORE);

        const dayColOptions = dayCols.map((col) => {
            return {field: getOptionDayField(col.field), headerName: getOptionDayName(col.headerName)};
        });

        const orderedOptions = getOrderedDays(dayColOptions);

        const dayOptionsToUse = checked ? defaultDayOptions : orderedOptions;

        return [...normalColOptions, ...dayOptionsToUse];
    }
};
