import {IProduct} from './api/types';
import moment from 'moment';
import {dateFormat, defaultRowFields} from './globalConstants';

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
